import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash'

const Messages = ({ messages, messageCount, currentUser, onScrollTop }) => {
    const messagesEnd = useRef()
    const messagesBox = useRef()
    const [scrollFromFetch, setScrollFromFetch] = useState(false)
    useEffect(() => {
        console.log('trigerred', messagesEnd.current)
        _.defer(()=>{
        console.log('trigerred1', messagesEnd.current)

        if (!scrollFromFetch && messagesEnd.current){
            messagesEnd.current.scrollIntoView({ behavior: "smooth" })
        }else if(scrollFromFetch)  {
            setScrollFromFetch(false)
        }
        })
    }, [messageCount])

    const handleScroll = ()=>{
        if(messagesBox.current.scrollTop === 0) {
            // messagesBox.current.scrollTop = 10
            messagesBox.current.scrollTo({
                top: 20,
                behavior: 'smooth',
              })
            onScrollTop(messageCount)
            setScrollFromFetch(true)

        }
    }

    React.useEffect(() => {

        messagesBox.current.onscroll = _.debounce(handleScroll, 1000)
    
        return () => (window.onscroll = null);
      });

    let renderMessage = (message) => {
        const { sender, content, topic, color } = message;
        const messageFromMe = currentUser.username === message.sender;
        const className = messageFromMe ? "Messages-message currentUser" : "Messages-message";
        return (
            <li className={className}>
                <span
                    className="avatar"
                    style={{ backgroundColor: color }}
                />
                <div className="Message-content">
                    <div className="username">
                        {sender}
                    </div>
                    <div className="text">{content}</div>
                </div>
            </li>
        );
    };

return (
    <>
        {/* {(messageCount != chatMessageCount) && console.log("count", messageCount) && setChatMessageCount(messageCount)} */}
        <ul className="messages-list" ref={messagesBox}>
            {/* {scrollFromFetch? <div>loading...</div>: messages.map(msg => renderMessage(msg))} */}
            {messages.map(msg => renderMessage(msg))}
            <span style={{ float: "left", clear: "both" }} ref={messagesEnd}></span>
        </ul>
    </>
)
}


export default Messages