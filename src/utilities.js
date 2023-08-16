import React from "react";

function detectURLs(message) {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.match(urlRegex);
}

function handleURLs(content) {
    const urls = detectURLs(content);
    let updatedContent = content;
    const imgs = [];
  
    if (urls !== null) {
      urls.forEach(url => {
        const urlReplaced = url.replace("https://", "").split("/")[0];
  
        if (['tenor.com', 'media.discordapp.net', 'cdn.discordapp.com'].includes(urlReplaced)) {
          let gif = url;
          if (urlReplaced === 'tenor.com') {
            gif += '.gif';
          }
          imgs.push(<img src={gif} />);
          updatedContent = updatedContent.replace(url, "");
        }
      })
    };
  
    return { updatedContent, imgs };
}
  
function handleAttachments(attachments) {
    const attachmentElements = [];
  
    for (const attach in attachments) {
      const { content_type, url, filename } = attachments[attach];
      const fileType = content_type.split('/')[0];
  
      switch (fileType) {
        case 'image':
          const img = (
            <img
              src={url}
              alt={filename}
              className={filename.startsWith('SPOILER') ? 'spoiler' : ''}
            />
          );
          attachmentElements.push(img);
          break;
        case 'video':
          const videoText = `[${filename}]`;
          attachmentElements.push(<p>{videoText}</p>);
          break;
      }
    }
  
    return attachmentElements;
}
  
function handleText(content) {
    const regex = /<([^>]+)>/g;
    const splitted = content.split(regex).map(part => part.trim());
    const text = [];
  
    for (const part of splitted) {
      if (/^:\w+:\d+$/.test(part)) {
        const id = part.match(/:(\d+)/)[1];
        const emoteUrl = `https://cdn.discordapp.com/emojis/${id}.webp`;
        text.push(<img src={emoteUrl} alt={part} className="emote" />);
      } else {
        text.push(<>{part}</>);
      }
    }
  
    return <div className='text'>{text}</div>;
}

module.exports = {handleAttachments, handleURLs, handleText}