import React, { useState, useEffect, useRef } from 'react';

function MBox(props){

    console.log(props.replyMap ? props.replyMap.text: null)
    return(
        <li key={props.messageId} >
            <img className='avatar' src={props.avatar}/>
            <div>
                <div style={{display:'flex',margin:0, marginLeft:'1rem',fontSize:'0.8rem', opacity:0.8, alignItems:'center'}}>
                    {props.replyMap ? <h3 style={{color:props.color, margin:0, marginRight:'0.5rem', minWidth:'max-content'}}>{props.replyMap.name}</h3>:null}
                    {props.replyMap ? <div className='reply'>{props.replyMap.text.props.children}</div> : null}
                    {/* {props.replyMap ? props.replyMap.text.id = 'teste':null} */}
                </div>
                {/* {props.referenceMap} */}
                {/* {props.reference ? <h3 style={{maring:0, marginLeft:'0.5rem',fontSize:'0.8rem'}}>{props.reference.messageId}</h3>:null} */}
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

function TitleBar(props){

    function minimize(event){
        window.api.minimize()
    }

    function close(event){
        window.api.close()
    }

    return(
        <div id='title'>
            <div>
                <button id='configButton'  onClick={props.handleButtonClick} style={{margin: 0, width:'2.5rem', height:'1.5rem', borderRadius:'0'}}>&#x2630;</button>
            </div>
            <div id='drag' ></div>
            <div style={{display:'flex'}}>
                <button onClick={window.api ? minimize : null} style={{margin: 0, width:'2.5rem', height:'1.5rem', borderRadius:'0'}}>&minus;</button>
                <button onClick={window.api ? close : null} style={{margin: 0, width:'2.5rem', height:'1.5rem', borderRadius:'0'}}>&#10006;</button>
            </div>
        </div>
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
        const messageId = data.messageId
        const reference = data.reference
    
        const referenceMap = reference ? messages.find((map) => map['key'] === reference.messageId) : null
        const replyMap = reference && referenceMap ? {'name': referenceMap.props.name, 'color': referenceMap.props.color, 'text': referenceMap.props.text} : null

        const newElement = (
          <MBox
            key={data.messageId}
            name={name}
            color={nickColor}
            avatar={avatarUrl}
            text={text}
            imgs={imgs}
            attachmentElements={attachmentElements}
            messageId={messageId}
            replyMap={replyMap}
            referenceMap={referenceMap}
            reference={reference}
          />
        );
    
        setMessages([...messages.slice(-99), newElement]);
        
    }

    function handleButtonClick(event){
        if (event.target.id == 'configButton'){
            setIsButtonClicked(!isButtonClicked)
        }
        
        if (!isButtonClicked){
            props.socket.emit('configData', 'get')
        }
        
        if (event.target.id == 'darkBackground'){
            setIsButtonClicked(false)
            return
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
        <div>
            <TitleBar handleButtonClick={handleButtonClick}/>
            <div style={{display:'flex', maxHeight:'100vh', height:'calc(100vh - 1.5rem)', maxWidth:'100vw', overflowY:'scroll'}} className='interface' >
                <ul id='feed' style={{overflowX:'clip', maxHeight:'calc(100vh - 1.5rem)',Height:'calc(100vh - 2rem)'}} >
                    {messages}
                    <div style={{height: '1rem'}} ref={ref} />
                </ul>
                <div id={`${isButtonClicked ? 'darkBackground' : ''}`} style={{position:'fixed'}} onClick={handleButtonClick}>
                    <form id='config' style={isButtonClicked ? {display : 'block'} : {display : 'none'}} onSubmit={handleConfigSubmit} >
                        <input type="text" name='token' placeholder='Token' defaultValue={configData ? configData.token : ''} />
                        <input type="text" name='channel' placeholder='Channel' defaultValue={configData? configData.channelId : ''} />
                        <button type="submit">Apply</button> 
                    </form>
                </div>
            </div>    
        </div>
    )       
}

export default Interface;