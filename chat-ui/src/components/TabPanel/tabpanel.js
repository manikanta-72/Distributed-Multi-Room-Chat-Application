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
            style={{ width: value == index? "100%": 0, visibility: value == index? 'visible': 'hidden', background: "cornsilk" }}
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

const ChatView = ({user, newMessage, topic}) => {
    const [messages, setMessages] = useState([])


    const onScrollTop = (offset)=>{
        chatAPI.getMessages(topic, offset).then(({data})=>{
            let _messages = _.reverse(_.filter(data.messages, msg=> _.toLower(msg.topic) == topic))
            setMessages(_.concat(_messages, messages))
        })     
    }

    useEffect(() => {
        if (newMessage!=null){
            if(newMessage.topic == topic){
                onMessageReceived(newMessage);
            }
        }
      }, [newMessage]);

      useEffect(() => {
        chatAPI.getMessages(topic, 0).then(({data})=>{
            let messages = _.reverse(_.filter(data.messages, msg=> _.toLower(msg.topic) == topic))

            setMessages(messages)
        })
      }, []);

    let onMessageReceived = (msg) => {
        console.log('New Message Received!!', msg);
        setMessages(messages.concat(msg));
    }

    let onSendMessage = (msgText) => {
        chatAPI.sendMessage(user.username, msgText, topic).then(res => {
            console.log('Sent', res);
        }).catch(err => {
            console.log('Error Occured while sending message to api');
        })
    }

    return (
        <>
            <Messages messages={messages} messageCount={messages.length} onScrollTop={onScrollTop} currentUser={user} />
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
                style={{ border: "1px dotted gray", backgroundColor: "darkkhaki" }}
            >
                <Tab label="Topic 1" {...a11yProps(0)} />
                <Tab label="Topic 2" {...a11yProps(1)} />
                <Tab label="Topic 3" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0} >
                <ChatView user={user} newMessage={newMessage} topic={"topic1"}/>
            </TabPanel>
            <TabPanel value={value} index={1} >
                <ChatView user={user} newMessage={newMessage} topic={"topic2"}/>
            </TabPanel>
            <TabPanel value={value} index={2} >
                <ChatView user={user} newMessage={newMessage} topic={"topic3"}/>
            </TabPanel>
        </Box>
    );
}
