import React, { useState, useEffect, useRef } from 'react';

function MBox(props){
    return(
        <li key={props.messageId} >
            <img className='avatar' src={props.avatar}/>
            <div>
                <h3 className='username' style={{color: props.color}}>{props.name}</h3>
                <div className='content'>
                    {props.text}
                    {props.imgs}
                    {props.attachmentElements}
                </div>
            </div>
        </li>
    )
}

function Interface(props){
    const [messages, setMessages] = useState([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [configData, setConfigData] = useState(false);
    const ref = useRef(null)

    
    useEffect( () => {

        props.socket.on('message', data => {
            addMessage(data);
        })

        props.socket.on('configData', data => {
            setConfigData(data)
        })
    
        return () => {
          props.socket.off('message');
          ref.current?.scrollIntoView({behavior: "smooth"})
        };

      }, [messages]);


    function addMessage(data) {
        const name = data.nickname ? data.nickname : data.username;
        const nickColor = data.color;
        const avatarUrl = data.avatar;
        
        const { updatedContent, imgs } = props.handleURLs(data.cleanContent);
        const attachmentElements = props.handleAttachments(data.attachments);
        const text = props.handleText(updatedContent);
    
        console.log(data)

        const newElement = (
          <MBox
            name={name}
            color={nickColor}
            avatar={avatarUrl}
            text={text}
            imgs={imgs}
            attachmentElements={attachmentElements}
            messageId={data.messageId}
          />
        );
    
        setMessages([...messages.slice(-99), newElement]);
        
    }

    function handleButtonClick(event){
        if (event.target.id == 'darkBackground'){
            setIsButtonClicked(false)
            return
        }
        if (event.target.id == 'configButton'){
            props.socket.emit('configData', 'get')
            setIsButtonClicked(true)
        }

    }

    function handleConfigSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = {
            token: formData.get('token'),
            channelId: formData.get('channel')
        }

        props.socket.emit('configData', data)
    }

    return(
        <div style={{display:'flex'}} className='interface' >
            <ul id='feed'>
                {messages}
                <div style={{height: '1rem'}} ref={ref} />
            </ul>
            <button id='configButton' type="button" onClick={handleButtonClick} style={{position: 'fixed', right:'0.5rem', top:'0.5rem', margin:'0'}} />
            <div id={`${isButtonClicked ? 'darkBackground' : ''}`} style={{position:'fixed'}} onClick={handleButtonClick}>
                <form id='config' style={isButtonClicked ? {display : 'block'} : {display : 'none'}} onSubmit={handleConfigSubmit} >
                    <input type="text" name='token' placeholder='Token' defaultValue={configData ? configData.token : ''} />
                    <input type="text" name='channel' placeholder='Channel' defaultValue={configData? configData.channelId : ''} />
                    <button type="submit">Apply</button> 
                </form>
            </div>
        </div>    
    )       
}

export default Interface;