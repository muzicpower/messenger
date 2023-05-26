import { Provider}                      from 'react-redux'
import {CMessengerSwitch, CMessenger}   from './messenger.js'
import {store}                          from './messengerState.js'

export const Demo=()=>(
    <Provider store={store}>
        <CMessengerSwitch   loc={{top: 70, left: 370}} />
        <CMessenger         loc={{top: 150, left: 100}} />
    </Provider>
);

