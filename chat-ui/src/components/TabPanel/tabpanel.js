import React, { useState, useEffect, memo } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core//Box';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import _ from 'lodash'

import chatAPI from '../../services/chatapi';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            // hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: value == index? "100%": 0, visibility: value == index? 'visible': 'hidden' }}
            {...other}
        >
            <Box style={{ width: "100%" }}>
                <Typography style={{ height: "85vh" }}>{children}</Typography>
            </Box>
            
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const ChatView = ({user, newMessage}) => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (newMessage!=null){
            onMessageReceived(newMessage);
        }
      }, [newMessage]);

    let onMessageReceived = (msg) => {
        console.log('New Message Received!!', msg);
        setMessages(messages.concat(msg));
    }

    let onSendMessage = (msgText) => {
        chatAPI.sendMessage(user.username, msgText).then(res => {
            console.log('Sent', res);
        }).catch(err => {
            console.log('Error Occured while sending message to api');
        })
    }

    return (
        <>
            <Messages messages={messages} currentUser={user} />
            <Input onSendMessage={onSendMessage} />
        </>
    )
}

export default function GroupView({ user , newMessage}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            style={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                style={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Topic 1" {...a11yProps(0)} />
                <Tab label="Topic 2" {...a11yProps(1)} />
                <Tab label="Topic 3" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0} >
                <ChatView user={user} newMessage={newMessage}/>
            </TabPanel>
            <TabPanel value={value} index={1} >
                <ChatView user={user} newMessage={newMessage}/>
            </TabPanel>
            <TabPanel value={value} index={2} >
                <ChatView user={user} newMessage={newMessage}/>
            </TabPanel>
        </Box>
    );
}
