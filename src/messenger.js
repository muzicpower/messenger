import {connect,}                               from 'react-redux'
import React, {useRef, useEffect, useState,}    from 'react'
import Draggable                                from "react-draggable";

import {
    List,ListItem,Divider,ListItemText,
    ListItemAvatar,Avatar,IconButton, Tabs, 
    Tab, Tooltip,MenuItem, ListItemIcon, Menu, 
    Slide, Box, TextField, Typography,
}                                               from '@mui/material';

import CancelIcon                               from '@mui/icons-material/Cancel';
import MessageIcon                              from '@mui/icons-material/Message';
import DisabledByDefaultIcon                    from '@mui/icons-material/DisabledByDefault';
import CheckIcon                                from '@mui/icons-material/Check';

import {
    STATUS_OFFLINE, STATUS_ACTIVE, STATUS_IDLE, 
    STATUS_BUSY, MSG_PUBLIC, openTab, closeTab, 
    changeTab, minimize,pushMessage, 
    updateUserStatus,
}                                               from './messengerState.js';

const trimName = (name,maxLength, replacement = null) => {
    if (replacement!=null && replacement[0]==name) return replacement[1];
    if (name.length > maxLength) return name.substr(0, maxLength-2) + "..";
    else return name;
}
const getTimestamp = ()=>{ //"15:14:32 10/15/22";
    let d = new Date();
    return `${d.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})} ${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()%100}`; 
}

const cLemon    = "#FFEE58"; 
const cMidBlue  = "#1976D2";
const mapUserStatusColor = { //
    STATUS_ACTIVE:  "#76FF03",
    STATUS_OFFLINE: "#9E9E9E",
    STATUS_IDLE:    "#FFA500",
    STATUS_BUSY:    "red",
};
const mapUserStatusDescription = {
    STATUS_ACTIVE:  "active",
    STATUS_OFFLINE: "offline",
    STATUS_IDLE:    "idle",
    STATUS_BUSY:    "busy - do not disturb",
    "MSG_PUBLIC_STATUS":   "message to everyone",
};

const MessengerUI = ({
    loc,     
    myinfo,
    userList,
    messages,
    currentTabIdx,
    openTabs,

    cmdKeyboard,
    cmdClickCloseMessenger,
    cmdMenu,
    cmdUserListClick,
    cmdTabSelect,
    cmdTabClose,
                                    }) => {
    const cBorder       = "red";
    const clipBdsz      = 0;
    const tabBdsz       = 0;
    const keyboardBdsz  = 0;
    const bdsz          = 3;

    const mg = 20;
    const [chatW, chatH] = [400,300];
    const [keyboardIndent, keyboardH] = [20, 62];
    const [lpW, lpH] = [160, 140];
    const [ulW, ulH] = [148, Math.min(200,Object.values(userList).length*46-20)];
    const iconDim = 40;
    const [tabW, tabH] = [chatW+60, 55];

    const _UserTabs = ({loc, currentTabIdx, openTabs, userList})=>{
        const mgn = 5;
        const width = tabW;
        const height = tabH;
        const tabEleW = 100;
        const tabEleH = tabH;

        const _onTabClick = (idx)=>(e)=>cmdTabSelect(idx)
        const _onCancelIconClick = (person,idx)=>(e)=>{      
            cmdTabClose(person.name, idx);
            e.stopPropagation();
        }
        const _generateTab = (personName,idx)=>{
            let p = userList[personName].personinfo;

            const cFont = "white";
            const borderColor = currentTabIdx==idx? "red" : "white";
            const backgroundColor = currentTabIdx==idx? "red" : "grey";
            const cCancelIcon = "black";
            const tabSx = {
                opacity:    idx==currentTabIdx? 1 : 0.9,
                width:      tabEleW,
                height:     tabEleH,
                border:     2,
                borderColor,
                backgroundColor,
                borderTopLeftRadius: 10,borderTopRightRadius:10,
            };
            const _getIcon = ()=>{
                const ttpStatus = {sx: {top:0, left:0, color:"white", bgcolor:"red",'& .MuiTooltip-arrow': {color:"red", },},};
                return ( <>
                    <Tooltip title={mapUserStatusDescription[p.status]} arrow placement="top-start" componentsProps={{tooltip:ttpStatus}}>
                        <Avatar alt={p.name} src={p.avatar} position="absolute" sx={{top:-16, left:-30, width:30, height:30, }} />
                    </Tooltip>
                    { idx!=0 &&
                        <>
                        <Box border={2} style={{position:"absolute", top:20,left:24,width:10, height:10, borderColor:"white", backgroundColor: mapUserStatusColor[p.status], borderRadius:"50%"}}></Box>
                        <CancelIcon style={{ position: "absolute", top:6, left:tabEleW-30, fontSize:22, color:cCancelIcon}} onClick={_onCancelIconClick(p,idx)}/>
                        </>
                    }
                    </>);
            }
            const _getLabel = ()=>(
                <Typography style={{position:"absolute",left:5, top:tabEleH-20, cursor:"pointer", fontSize: 12, color: cFont}} onClick={_onTabClick(idx)} >
                    {trimName(personName, 12, [MSG_PUBLIC, "PUBLIC"])}
                </Typography>
            )
            //<Draggable axis="x" onStop={(e,info)=>console.log(`drag stop: x: ${info.x}, y: ${info.y}`)} key={idx} value={idx}>
            return <Tab key={idx} value={idx} onClick={_onTabClick(idx)} icon={_getIcon()} label={_getLabel()} sx={tabSx}/>
        }
        return(
        <Box border={clipBdsz} sx={{overflow: "hidden", top:loc.bottom-loc.height, left:loc.left, width:loc.width+mgn, height:loc.height, borderColor:"grey", position:"absolute"}}>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={{ enter: 1500, exit: 300 }} style={{ transitionDelay: 700 }}>
                <Box border={tabBdsz} sx={{top:bdsz,left:bdsz, width:loc.width, height:loc.height, borderColor:cBorder, position:"absolute",}}>
                    <Tabs scrollButtons={true} variant="scrollable" value={currentTabIdx}  sx={{width, height, borderRadius: 10,}}>   
                        {openTabs.map(_generateTab)}
                    </Tabs>
                </Box>
            </Slide>
        </Box>
        );
    }
    const _CloseMessengerIcon = ({loc,})=> {
        const mgn = 5;

        const onClick = ()=>{ cmdClickCloseMessenger();}

        return(
        <Box border={clipBdsz} sx={{overflow: "hidden", top:loc.top, left:loc.left, width:loc.width+mgn, height:loc.height+mgn, borderColor:"grey", position:"absolute"}}>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 300, exit: 300 }} style={{ transitionDelay: 1000 }}>
                <Box border={bdsz} sx={{top:0,left:0, width:loc.width, height:loc.height, borderColor:cBorder, position:"absolute",borderTopRightRadius:7, borderBottomRightRadius:7}}>
                    <IconButton position="absolute" sx={{border:1, borderColor:"black", top:0, left:0, width:loc.width, height:loc.height}} onClick={onClick}>
                        <DisabledByDefaultIcon sx={{ position:"absolute", color:cBorder, top:-9, left:-9, fontSize: 56,borderRadius:10}} />
                    </IconButton>
                </Box>
            </Slide>
        </Box>
        )
    }
    const _LeftPanel = ({loc,})=>{
        const mgn = 5;
        
        const _UserList = ({loc})=>{
            const scrollW = bdsz;
            const mgn = 5;
            const scrollProp = {
                overflow: 'auto', 
                '&:hover':{
                    "&::-webkit-scrollbar":         { width: scrollW, height: 200,},
                    "&::-webkit-scrollbar-track":   {backgroundColor: cBorder,},
                    "&::-webkit-scrollbar-thumb":   {backgroundColor: cMidBlue,},
                },
                "&::-webkit-scrollbar":             {width: scrollW,height: 200,},
                "&::-webkit-scrollbar-track":       {backgroundColor: cBorder,},
                "&::-webkit-scrollbar-thumb":       {backgroundColor: cBorder,},
            };
            const _onClick = (personinfo)=>(e)=>cmdUserListClick(personinfo)
            const _generateUser = ({personinfo},idx)=>{ //item == person object
                const tooltip = {sx:{bgcolor:"red", color:"white",'& .MuiTooltip-arrow': {color: "red", },},}
                const sx = {top:0, left:scrollW, width: ulW-scrollW*2, borderRadius:1,
                    transition: "background 0.15s, color 0.15s",
                    "&:hover": {
                        borderRadius:1,
                        backgroundColor: "lightgreen",
                        color: "blue"
                    },
                };
                return (
                <ListItem onClick={_onClick(personinfo)} key={idx} sx={sx} >
                    <Tooltip title={mapUserStatusDescription[personinfo.status]} arrow placement="top" componentsProps={{tooltip}}>
                        <Avatar src={personinfo.avatar} alt={personinfo.name} position="absolute"sx={{left:-12, top: 0, maxHeight: 30, maxWidth: 30, }} />
                    </Tooltip>
                    <Box border={2} style={{position:"absolute", top:24, left:24, width:10, height:10, backgroundColor:mapUserStatusColor[personinfo.status] , borderColor:"white", borderRadius:"50%",}}/>
                    <Typography style={{position:"absolute", top:6, left:45, fontSize: 13, color: 'black'}} cursor="pointer">
                        <strong>{ trimName(personinfo.name, 12,[MSG_PUBLIC,"TO PUBLIC"]) } </strong>
                    </Typography>
                    <Typography style={{position:"absolute", top:26, left:45, fontSize: 11, color: 'grey'}} cursor="pointer">
                        {personinfo.role}
                    </Typography>
                    <Box border={0} style={{position:"absolute", borderColor:"green", top:0, left:0, width:ulW-scrollW*2, height:42, cursor:"pointer"}}/>
                </ListItem>
                )
            }
            const _userlistWithoutPublic = (list) => {
                return Object.values(list).filter(i=>i.personinfo.name!=MSG_PUBLIC);
            }
            const _numUsersOn=(list)=>{
                let nOnline = Object.values(list).filter(i=>i.personinfo.status!=STATUS_OFFLINE).length;
                let nTotal = Object.values(list).length;  
                return `Users (${nOnline}/${nTotal})`;
            }
            const listNoPublic = _userlistWithoutPublic(userList);
            return(
            <Box border={clipBdsz} sx={{overflow: "hidden", top:loc.top, left:loc.left, width:loc.width+mgn+1, height:loc.height + mgn+1, borderColor:"grey", position:"absolute"}}>
                <Slide direction="down" in={true} timeout={{ enter: 300, exit: 300 }} style={{ transitionDelay: 800 }} mountOnEnter unmountOnExit>
                    <Box border={bdsz} sx={{top:0,left:0, width:loc.width, height:loc.height, backgroundColor:cLemon, borderColor:cBorder, position:"absolute", borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                        <Divider position="relative" textAlign="center" >
                            <strong> {_numUsersOn(listNoPublic)}</strong>
                        </Divider>
                        <List position="absolute" sx={{ top:0, left:0, width: ulW+bdsz, height: ulH-42, ...scrollProp,}}>
                            {listNoPublic.map(_generateUser)} 
                        </List> 
                    </Box>
                </Slide>
            </Box>
            );
        }
        const _MyProfile = ({myinfo}) => {
            let tooltip = { sx: {position:"absolute", top:5,left:-10, color:"white", bgcolor:cBorder ,'& .MuiTooltip-arrow': {color: cBorder, },},};
            const [anc, setAnc] = useState(null);

            const _onClick = (e)=>{setAnc(e.currentTarget);}
            const _onMenuClose = (itemSelected)=>()=>{
                cmdMenu(itemSelected);
                setAnc(null);
            }
            const _Avatar = ()=>{
                return(<>
                <Tooltip title={mapUserStatusDescription[myinfo.status]} arrow placement='right'componentsProps={{tooltip}}>
                    <IconButton onClick={_onClick}>
                        <Avatar src={myinfo.avatar} alt={myinfo.name} style = {{top:0, left:0, width: 80, height:80, }}/>
                        <Box  border={2} borderColor="white" position="absolute"  sx={{top:60, left:70, 
                            width:20, height:20,  backgroundColor:mapUserStatusColor[myinfo.status], borderRadius:"50%"}}/>
                    </IconButton>
                </Tooltip>
                <Typography style={{position:"absolute", top:88, left:10, fontSize: 20, color: 'black'}}>
                    {trimName(myinfo.name, 8)}
                </Typography>
                <Typography style={{position:"absolute",top:110,left:10,fontSize: 13, color: 'grey'}}>
                    {myinfo.role}
                </Typography>
                </>);
            }
            const _StatusMenu = ()=>(
                <Menu anchorEl={anc} open={Boolean(anc)} style={{position:"absolute", top: -93, left:100,}} onClose={_onMenuClose("none")}position="absolute">
                {   Object.keys(mapUserStatusColor).filter(i=>i!="STATUS_OFFLINE").map((status,idx)=>(
                        <MenuItem key={idx} onClick={_onMenuClose(status)}>
                            <ListItemIcon>{myinfo.status == status && <CheckIcon fontSize="small"/>}</ListItemIcon>
                            {status.slice(7).toLowerCase()}
                        </MenuItem>
                    ))
                }
                </Menu>
            )
            return (
            <Box border={1} style={{left:mgn, top:mgn, width:loc.width-2*mgn+1, height:loc.height-2*mgn-2, 
                borderColor:"black", backgroundColor: "lightyellow", borderRadius: 10, position:"absolute"}}>
                {_Avatar()}
                {_StatusMenu()}
            </Box>
            );
        }
        //<UserList loc={{top:loc.height, left:(loc.width-ulW)/2, width:ulW, height:ulH}}/>
        return(
        <Box border={clipBdsz} sx={{overflow: "hidden", top:loc.top, left:loc.right-loc.width-mgn, width:loc.width+mgn, height:loc.height+mgn*2+ulH, borderColor:"grey", position:"absolute",}}>
            <Slide direction="left" in={true} timeout={{ enter: 300, exit: 300 }} style={{ transitionDelay: 500 }} mountOnEnter unmountOnExit >
                <Box border={bdsz} sx={{top:0,left:0, width:loc.width+mgn, height:loc.height, backgroundColor:cLemon, borderColor:cBorder, position:"absolute", borderTopLeftRadius:10, borderBottomLeftRadius:10,}}>
                    {_MyProfile({myinfo, })}
                    {_UserList( {loc:{top:loc.height, left:(loc.width-ulW)/2, width:ulW, height:ulH}})}
                </Box>
            </Slide>
        </Box>
        );
    }
    const _KeyboardInput = ({loc, isInputDisabled=false, })=>{
        const mgn = 5;
        const kbRef = useRef();

        useEffect(()=>{setTimeout(()=>{kbRef.current.focus();},0)},[])

        const _onKeyDown = (e)=>{cmdKeyboard(e,kbRef);}

        return(
        <Box border={clipBdsz} sx={{overflow: "hidden", top:loc.top, left:loc.left, width:loc.width+mgn, height:loc.height+ mgn, borderColor:"grey", position:"absolute"}}>
            <Slide direction="down" in={true} timeout={{ enter: 400, exit: 100 }} style={{ transitionDelay: 100 }} mountOnEnter unmountOnExit>
                <Box border={keyboardBdsz} sx={{top:0,left:0, width:loc.width, height:loc.height, borderColor:cBorder, position:"absolute", }}>
                    <Box border={0} style={{position:"absolute", borderColor:"red", backgroundColor:"lightyellow", borderRadius:5, top:10, left:0, width:loc.width+3,height:54, }}/>
                    <TextField inputRef={kbRef} placeholder={"alt + q or w == switch tab"}label="Type a Message" variant="outlined" style={{top:10, width:loc.width+mgn, borderColor:cBorder}}
                        InputLabelProps={{ shrink: true }}disabled={isInputDisabled} onKeyDown={_onKeyDown}/>
                </Box>
            </Slide>
        </Box>
        );
    }
    const _ChatDisplay = ({loc, messages})=>{
        const mg = 2;
        const scrollW = bdsz;
        const scrollProp = {
            overflow: 'auto',
            '&:hover':{
                "&::-webkit-scrollbar":         {width: scrollW,},
                "&::-webkit-scrollbar-track":   {backgroundColor: cBorder,},
                "&::-webkit-scrollbar-thumb":   {backgroundColor: cMidBlue,borderRadius: 0}
            },
            "&::-webkit-scrollbar":         {width: scrollW,},
            "&::-webkit-scrollbar-track":   {backgroundColor: cBorder,},
            "&::-webkit-scrollbar-thumb":   {backgroundColor: cBorder,borderRadius: 0},
        };
        const listRef = useRef(); 
        useEffect(()=>{
            listRef.current&&listRef.current.scroll({top:10000, behavior:"smooth"});
        },[messages]);

        const _getMessage = (message, isNotDelivered) => (<>
            {   isNotDelivered &&
                <Typography component="span" style={{fontSize: 16, color: 'red'}}> <strong>Message Not Delivered</strong><br/></Typography>
            }
            <Typography component="span" style={{fontSize: 16, color: 'black'}}> {message} </Typography>
            </>
        )
        const _genMsgEle = (msgElem, msgElemIdx)=>{
            return(
            msgElem.sender != myinfo.name?
            <ListItem alignItems="flex-start" key={msgElemIdx}>
                <ListItemAvatar>
                    <Avatar sx={{height:30,width:30}} alt={msgElem.sender} src={userList[msgElem.sender].personinfo.avatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography style={{fontSize: 14, color: 'grey'}}>
                            {msgElem.sender + ", "+msgElem.time}
                        </Typography>}
                    secondary={
                        <Typography style={{fontSize: 16, color: 'black'}}>
                            {msgElem.message}
                        </Typography>}
                    />
            </ListItem>
            :
            <ListItem alignItems="flex-start" key={msgElemIdx}>
                <ListItemText align="right"
                    primary={<Typography style={{fontSize: 14, color: 'grey'}} component="span">{"me, " + msgElem.time}</Typography>}
                    secondary={ _getMessage(msgElem.message, msgElem.isNotDelivered)}/>
            </ListItem>
            )
        }
        return (
        <Box border={bdsz} style={{position:"absolute",top:0,left:0,width:loc.width, height:loc.height, backgroundColor:"lightgreen" ,borderColor:cBorder, borderRadius:10}}>
            <List ref={listRef} sx={{ top:8, left: bdsz, width: loc.width, height: loc.height-32, border:0, borderColor:"blue", ...scrollProp}}>
                {messages.map(_genMsgEle)}
            </List>
        </Box>
        );
    }
    const _DragBar = ({loc, name})=><Box className={name} border={0} style={{position:"absolute",...loc, borderRadius:10}}/>

    return(
    <Box border={0} style={{...loc, width:450,height:400, position:"absolute"}}>
        {_CloseMessengerIcon({loc:{top:mg,  left:chatW+bdsz, width:iconDim, height:iconDim}})}
        {_ChatDisplay       ({loc:{top:0,   left:0, width:chatW, height:chatH}, messages,})}
        {_KeyboardInput     ({loc:{top:chatH+bdsz,left:keyboardIndent,width:chatW-keyboardIndent*2,height:keyboardH}})}
        {_LeftPanel         ({loc:{top:mg, right:0,width:lpW, height:lpH}})}
        {_UserTabs          ({loc:{bottom:0, left:(chatW-tabW)/2, width:tabW, height:tabH}, currentTabIdx, openTabs, userList,})}
        {_DragBar           ({loc:{top:0,left:bdsz, width:chatW-bdsz, height:30}, name:"dhMessenger"})}
    </Box>
    );
}

export const CMessenger = connect(state=>({
    myinfo:             state.msgRdc.myinfo,
    openTabs:           state.msgRdc.openTabs,
    currentTabIdx:      state.msgRdc.currentTabIdx,
    isMinimized:        state.msgRdc.isMinimized,
    userList:           state.msgRdc.friends,
                                                            }),{
    pushMessage, minimize, openTab, changeTab, closeTab, updateUserStatus,
                                                            })(({
    myinfo,
    openTabs,
    currentTabIdx,
    isMinimized,
    userList,

    pushMessage, minimize, openTab, changeTab, closeTab, updateUserStatus,

    loc={top:0, left:0}
})=>{
    //commanders
    const cmdMenu = (itemSelected) => {
        switch(itemSelected){
            case "STATUS_BUSY":
            case "STATUS_ACTIVE":
            case "STATUS_IDLE":{
                let sendObj = { 
                    code: "USER_STATUS_CHANGE",
                    payload:{
                        username: myinfo.name,
                        status: itemSelected,
                    }
                };
                updateUserStatus(myinfo.name, itemSelected);
                //outboundEnq(sendObj);
                break;
            }
            default:
                break;
        }         
    }
    const cmdKeyboard = (e, kbRef) =>{
        if (e.key == "Enter" && kbRef.current && kbRef.current.value.length>0 ){
            let sendObj = {
                code: openTabs[currentTabIdx] == MSG_PUBLIC? "MSG_TXT_PUBLIC" : "MSG_TXT_INDI",
                payload:{
                    sender: myinfo.name, 
                    receiver: openTabs[currentTabIdx], 
                    time: getTimestamp(), 
                    message: kbRef.current.value,
                }
            }
            pushMessage(sendObj.payload);
            //outboundEnq(sendObj);
            kbRef.current.value="";
        }
        // e.metaKey : windows key
        // e.ctrlKey
        // e.shiftKey
        if ( e.altKey && e.key == "w"){
            changeTab((currentTabIdx+openTabs.length+1)%openTabs.length);
        }
        else if ( e.altKey && e.key == "q"){
            changeTab((currentTabIdx+openTabs.length-1)%openTabs.length);
        }
        else if ( e.altKey && e.key == "3"){
            minimize(true);
        }

    }
    const cmdClickCloseMessenger = () =>{minimize(true);}
    const cmdTabSelect = (idx) =>{changeTab(idx);}
    const cmdTabClose = (name,idx)=>{closeTab(name, idx);}
    const cmdUserListClick = (personinfo) => {openTab(personinfo.name);}

    const _ErrorMsg = ({loc})=>(
        <Draggable handle=".error">
        <Box className="error" border={5} style={{position:"absolute", ...loc, width:200, height:100, borderColor:"green", backgroundColor:"orange"}} >
            <Typography align="center" style={{fontSize: 16, color: 'red'}}>
                <strong>You should NOT see this message (if CMessengerSwitch is working correctly) </strong>
            </Typography>
        </Box>
        </Draggable>
    )
    if (!isMinimized && Object.keys(userList).length == 0) return _ErrorMsg({loc});
    return (
    <Draggable handle=".dhMessenger">
        {   isMinimized? <></> :
            MessengerUI({
                loc:{top:loc.top+100, left:loc.left+100},
                myinfo,
                userList,
                messages:userList[openTabs[currentTabIdx]].messages,
                openTabs,
                currentTabIdx,
                cmdKeyboard,
                cmdClickCloseMessenger,
                cmdMenu,
                cmdUserListClick,
                cmdTabSelect,
                cmdTabClose,
            })
        }
    </Draggable>
    )
});

export const CMessengerSwitch = connect(state=>({
    userList:           state.msgRdc.friends,
    isMinimized:        state.msgRdc.isMinimized,
    msgCntUnchecked:    state.msgRdc.uncheckedMsgCnt,
                                                    }),{
    minimize,
                                                    })(({
    userList,   
    isMinimized,        
    msgCntUnchecked,    

    minimize,

    loc,                                            })=>{

    const iconSize      = 40;
    const isAvailable   = Object.keys(userList).length > 0;
    const cIcon         = isAvailable? "orange" : "grey";
    const ttCaption     = isAvailable? "chat with us" : "messenger initializing";
    const cBg           = isAvailable? "red" : "grey";
    const ttp = {sx: {align:"center", position:"relative",top:4, left:19, color:"white", bgcolor: cBg,'& .MuiTooltip-arrow': {color: cBg,},},};

    const _onClick = ()=>{minimize(!isMinimized)}

    return (
    <Box border={0} style={{position:"absolute", borderColor:"red", top:loc.top, left:loc.left, width:iconSize, height:iconSize,}}>
        <Tooltip title={ttCaption} arrow placement='top'componentsProps={{tooltip: ttp}}>
            <span>
            <IconButton disabled={!isAvailable} onClick={_onClick} sx={{position:"absolute", top:0, left:0, width:iconSize, height:iconSize}}>
                <MessageIcon  style={{color:cIcon, fontSize: iconSize }}/>
            </IconButton>
            </span>
        </Tooltip>
        {   msgCntUnchecked > 0 &&
            <Box  sx={{position:"absolute", backgroundColor:"red", top:iconSize*0.5, left:iconSize*0.58, width:18, height:18, borderRadius:"50%"}}>
                <Typography align="center" style={{position:"relative", top:0,left:0, fontSize: 12, color: "white"}}>
                    <strong>{msgCntUnchecked}</strong>
                </Typography>
            </Box>
        }
    </Box>);
});