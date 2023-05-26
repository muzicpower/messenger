import { configureStore, createAction, }    from "@reduxjs/toolkit";

export const copyDeep    = obj => (JSON.parse(JSON.stringify(obj)));
export const copyShallow = obj => (Array.isArray(obj)? Object.assign([], obj) : Object.assign({}, obj));

const myName = "rla";
const myRole = "CUSTOMER";

const msgInit = {
    currentTabIdx:      0,     // -1 == no open tab, 0: MSG_PUBLIC always open 
    openTabs:           ["MSG_PUBLIC",],     // "MSG_PUBLIC" always at 0th position. ["Shea White", "Travis Scott", .. ]
    isInputDisabled:    false,
    isMinimized:        true,
    uncheckedMsgCnt:     0,

    myinfo:{
            name:      myName,
            role:      myRole,
            avatar:    "/avatar/11.png",
            status:    "STATUS_IDLE",
            email:     "smzsmz@gmail.com",
            phone:     "111-222-3333",
            addr:      "1111 Dr. Apt 222 CA 90020",
    },
    friends:{
        "Shea White": {
            personinfo:{
                name: "Shea White",
                role: "CUSTOMER",
                avatar: "/avatar/11.png",
                status: "STATUS_ACTIVE",
                phone: "123-321-1234",
                email: "Shea@gmail.com",
                addr: "222 333 some random addr CA 90009",
            },
            isTabOpen: false,
            messages:[
                {   isNotDelivered: true,
                    sender: myName,
                    receiver: "Shea White",
                    time: "5:53 PM 09/30/2022",
                    message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing"
                },
                {
                    sender: "Shea White",
                    receiver: myName,
                    time: "5:53 PM 09/30/2022",
                    message: "how are you."
                },
                {
                    sender: myName,
                    receiver: "Shea White",
                    time: "5:53 PM 09/30/2022",
                    message: "I am fine thank you."
                },
                {
                    sender: "Shea White",
                    receiver: myName,
                    time: "5:53 PM 09/30/2022",
                    message: "Cool."
                },
                    
            ]
        },
        "Dweyn Johnson": {
            personinfo:{
                name: "Dweyn Johnson",
                role: "CUSTOMER",
                avatar: "/avatar/9.jpg",
                status: "STATUS_IDLE",
                phone: "123-555-1234",
                email: "Johnson@gmail.com",
                addr: "Chicago Chicago Chicago 60231",
            },
            isTabOpen: false,
            messages:[]
        },
        "Feynmann": {
            personinfo:{
                name: "Feynmann",
                role: "CUSTOMER",
                avatar: "/avatar/8.jpg",
                status: "STATUS_BUSY",
                phone: "123-321-1234",
                email: "Feynmann@gmail.com",
                addr: "Feynmann's house on Feynmann's street CA 90009",
            },
            isTabOpen: false,
            messages:[]
        },
        "Turing": {
            personinfo:{
                name: "Turing",
                role: "ADMIN",
                avatar: "/avatar/7.jpg",
                status: "STATUS_BUSY",
                phone: "213-321-1234",
                email: "Turing@gmail.com",
                addr: "1234 Via Alicante San Jose CA 90009",
            },
            isTabOpen: false,
            messages:[]
        },
        "Swift": {
            personinfo:{
                name: "Swift",
                role: "CUSTOMER",
                avatar: "/avatar/6.jpg",
                status: "STATUS_ACTIVE",
                phone: "123-321-1234",
                email: "Swift@gmail.com",
                addr: "Cupertino CA 90000",
            },
            isTabOpen: false,
            messages:[]
        },        
        "mega": {
            personinfo:{
                name: "mega",
                role: "CUSTOMER",
                avatar: "/avatar/5.jpg",
                status: "STATUS_IDLE",
                phone: "212-343-6666",
                email: "Oh-mega@gmail.com",
                addr: "1234 San Francisco CA 90009",
            },
            isTabOpen: false,
            messages:[]
        },        
        "MSG_PUBLIC":{
            personinfo:{
                name:"MSG_PUBLIC",
                role:"PUBLIC",
                avatar: "/avatar/999.jpg",
                status: "MSG_PUBLIC_STATUS",
                
            },
            isTabOpen: true,
            messages:[]
        },
        "admin": {
            personinfo:{
                name: "admin",
                role: "ADMIN",
                avatar: "/avatar/4.jpg",
                status: "STATUS_ACTIVE",
                phone: "123-777-1234",
                email: "adminadmin@gmail.com",
                addr: "Philly Cheese Steak Ricci's hoagie",
            },
            isTabOpen: false,
            messages:[]
        },
    }
};

export const STATUS_ACTIVE          = "STATUS_ACTIVE"; //ToDo: rename to USER_STATUS_ACTIVE 
export const STATUS_OFFLINE         = "STATUS_OFFLINE";
export const STATUS_IDLE            = "STATUS_IDLE";
export const STATUS_BUSY            = "STATUS_BUSY";
export const MSG_PUBLIC             = "MSG_PUBLIC"; //public speaker identifier

const MSG_INIT                      = "MSG_INIT";
const MSG_PUSH_MESSAGE              = "MSG_PUSH_MESSAGE";
const MSG_PUSH_FRIEND               = "MSG_PUSH_FRIEND";
const MSG_UPDATE_CURRENT_USER_LIST  = "MSG_UPDATE_CURRENT_USER_LIST";
const MSG_OPEN_TAB                  = "MSG_OPEN_TAB";
const MSG_CLOSE_TAB                 = "MSG_CLOSE_TAB";
const MSG_CHANGE_TAB                = "MSG_CHANGE_TAB";
const MSG_MINIMIZE                  = "MSG_MINIMIZE";
const MSG_UPDATE_USER_STATUS        = "MSG_UPDATE_USER_STATUS";
const MSG_ON_NEW_MSG                = "MSG_ON_NEW_MSG";
const MSG_UPDATE_PROFILE            = "MSG_UPDATE_PROFILE";

export const initMsg                = (prop)                =>createAction(MSG_INIT)                    (prop);
export const minimize               = (isMinimized)         =>createAction(MSG_MINIMIZE)                ({isMinimized});
export const changeTab              = (tabIdx)              =>createAction(MSG_CHANGE_TAB)              ({tabIdx});
export const openTab                = (personName)          =>createAction(MSG_OPEN_TAB)                ({personName});
export const pushMessage            = (msgEle)              =>createAction(MSG_PUSH_MESSAGE)            (msgEle);   //addMessage
export const pushFriend             = (username)            =>createAction(MSG_PUSH_FRIEND)             (username); //addUser
export const updateCurrentUserList  = (userList)            =>createAction(MSG_UPDATE_CURRENT_USER_LIST)(userList);    //updateUserList
export const closeTab               = (personName,tabIdx)   =>createAction(MSG_CLOSE_TAB)               ({personName,tabIdx});
export const updateUserStatus       = (username, status)    =>createAction(MSG_UPDATE_USER_STATUS)      ({username,status});
export const onNewMsg               = ()                    =>createAction(MSG_ON_NEW_MSG)              ();
export const updateProfile          = (prop)                =>createAction(MSG_UPDATE_PROFILE)          (prop);

const msgRdc = (state = {...msgInit}, action)=>{
    let res = copyShallow(state);
    let type = action.type;
    let pl = action.payload;
    const _openTab = personName =>{
        if (res.friends[personName].isTabOpen == true) { //tab already opened. Just update currentTabIdx
            res.currentTabIdx = res.openTabs.findIndex(item=>(item == personName));
            res.isInputDisabled = false;
        }
        else{ //new tab open
            res.friends = {
                ...res.friends,
                [personName] : {
                    ...res.friends[personName],
                    isTabOpen: true,
                }
            };
            res.openTabs = [...res.openTabs, personName]; //push back
            res.currentTabIdx = res.openTabs.length - 1;
            res.isInputDisabled = false
        }
    }
    switch(type){
        case MSG_INIT:
            if (pl == null) res = {...msgInit};
            else{
                res.myinfo = pl.myinfo;     //res.friends remains as {}
                res.chatHistory = pl.chatHistory; //pl.chatHistory == {"mega":{me,friend,messages:[{isNotDeliverd, sender, receiver, time,message} ...]} }
            }
            break;
        case MSG_UPDATE_PROFILE:
            res.myinfo = {
                ...res.myinfo,
                email:  pl.email,
                phone:  pl.phone,
                addr:   pl.addr,
            };
            break;
        case MSG_UPDATE_USER_STATUS:{
            if (pl.username != res.myinfo.name){
                if (res.friends[pl.username]){
                    res.friends = copyShallow(res.friends);
                    res.friends[pl.username] = copyShallow(res.friends[pl.username]);
                    res.friends[pl.username].personinfo = copyShallow(res.friends[pl.username].personinfo);
                    res.friends[pl.username].personinfo.status = pl.status;
                }
            }
            else{ //myself
                res.myinfo = {
                    ...res.myinfo,
                    status: pl.status,
                };
            }
            break;
        }
        case MSG_UPDATE_CURRENT_USER_LIST:{ //pl: [{name, role, avatar, status, email, phone, addr} ... ]
            res.friends = {};               
                pl.forEach(i=>{
                if(i.name != res.myinfo.name){
                    res.friends[i.name]={
                        personinfo:     i,
                        isTabOpen:      false,
                        messages:       res.chatHistory[i.name]? res.chatHistory[i.name].messages : [],
                    };
                }
            });
            _openTab("MSG_PUBLIC");
            break;
        }
        case MSG_PUSH_FRIEND: 
            let friendName = pl.personinfo.name
            if (friendName != res.myinfo.name ){
                if( res.friends[friendName] == undefined){
                    res.friends = copyShallow(res.friends);
                    res.friends[friendName] = {
                        personinfo:     pl.personinfo,
                        isTabOpen:      false,
                        messages:       res.chatHistory[friendName]? res.chatHistory[friendName].messages : [],
                    };
                }
                else{   //this is when your friend logs out and then log in again. So only status is updated
                    res.friends = copyShallow(res.friends);
                    res.friends[friendName] = copyShallow(res.friends[friendName]);
                    res.friends[friendName].personinfo = copyShallow(res.friends[friendName].personinfo);
                    res.friends[friendName].personinfo.status = pl.personinfo.status;
                }
            }
            break;

        case MSG_PUSH_MESSAGE:{ //by receiving messages from friend
            res.friends = copyShallow(res.friends);
            let target = (pl.receiver==MSG_PUBLIC? MSG_PUBLIC : (pl.sender == res.myinfo.name? pl.receiver : pl.sender));
            res.friends[target] = copyShallow(res.friends[target]);
            res.friends[target].messages = [...res.friends[target].messages, pl];
            _openTab(target);
            break;
        }
        case MSG_OPEN_TAB:      //by clicking
            _openTab(pl.personName);
            break;
        
        case MSG_CLOSE_TAB:
            res.friends = copyShallow(res.friends);
            res.friends[pl.personName] = copyShallow(res.friends[pl.personName]); 
            res.friends[pl.personName].isTabOpen = false;

            res.openTabs = res.openTabs.filter(item=>(item != pl.personName));
            if (res.currentTabIdx >= pl.tabIdx){
                res.currentTabIdx -= 1;
                if (res.currentTabIdx == -1 && res.openTabs.length > 0) //does not happen due to MSG_PUBLIC
                    res.currentTabIdx = 0;
            }
            res.isInputDisabled = (res.openTabs.length == 0); //does not happen due to MSG_PUBLIC
            break;
        case MSG_CHANGE_TAB:   
            res.currentTabIdx = pl.tabIdx;
            break;
        case MSG_ON_NEW_MSG:{  
            if (res.isMinimized)
                res.uncheckedMsgCnt++;
            break;
        }
        case MSG_MINIMIZE:
            res.isMinimized = pl.isMinimized;
            if (pl.isMinimized == false) 
                res.uncheckedMsgCnt = 0;
            break;
        default:
            break;
    }
    return res;
}

//-- store --
export const store = configureStore({
    reducer: { msgRdc, },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(), //default MW contains Thunk
});