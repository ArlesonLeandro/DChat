import React, { useState, useEffect } from 'react';

function Overlay(props) {
  const [messages, setMessages] = useState([]);
  
  function addMessage(data) {
    const username = data.nickname ? data.nickname : data.username;
    const nickColor = data.color;
    const avatarUrl = data.avatar;

    const { updatedContent, imgs } = props.handleURLs(data.cleanContent);
    const attachmentElements = props.handleAttachments(data.attachments);
    const text = props.handleText(updatedContent);
    const messageId = data.messageId
    const reference = data.reference

    const reply = data.reply && {
      ...data.reply,
      content: props.handleText(data.reply.content)
    }

    const newElement = (
      <MBox
        key={messageId}
        username={username}
        color={nickColor}
        avatar={avatarUrl}
        text={text}
        imgs={imgs}
        attachmentElements={attachmentElements}
        timeout={10000}
        messageId={messageId}
        reference={reference}
        reply={reply}
      />
    );

    setMessages([newElement, ...messages]);
  }

  useEffect( () => {


    props.socket.on('message', data => {
      console.log(data)
      addMessage(data);
    })

    return () => {
      props.socket.off('message');
    };
  }, [messages]);

  return (
    <ul id='messages'>
      {messages}
    </ul>
  );
} 

function Expire(props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, props.delay);
    return () => clearTimeout(timer)
  }, [props.delay]);

  return visible ? <li key={props.messageId} className={props.className}>{props.children}</li> : null;
};


function MBox(props) {
  const { avatar, username, color, text, imgs, attachmentElements, timeout, messageId, reply } = props;

  return (
    <Expire className='message' messageId={messageId} delay={timeout}>
      <img className='avatar' src={avatar} alt="User Avatar"/>
      <div className='contentContainer'>
        {reply &&(
          <div style={{display:'flex',margin:0, marginLeft:'1rem',fontSize:'0.8rem', opacity:0.8, alignItems:'center'}}>
            <h3 style={{color:reply.color, margin:0, marginRight:'0.5rem', minWidth:'max-content'}}>{reply.name}</h3>
            <div className='reply'>{reply.content}</div>
          </div>
          )
        }
        <h3 className='username' style={{ color }}>{username}</h3>
        <div className='content'>
          {text}
          {imgs}
          {attachmentElements}
        </div>
      </div>
    </Expire>
  );
}
export default Overlay;