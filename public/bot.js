const { Client, Events, GatewayIntentBits} = require('discord.js');
const io = require('socket.io-client')
const socket = io('http://localhost:5000')
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
    ] });
const fs = require('fs')

class Bot{
    constructor(args){
        this.token = args.token
        this.targetChannel = args.targetChannel

        this.setup()
    }

    setup(){
        socket.on('configData', data => {
            if (data == 'get'){
                socket.emit('configData', {channelId: this.targetChannel, token: client.token})
                console.log({channelId: this.targetChannel, token: client.token})
                return
            }
            else{
                try {
                    if(data.token != client.token || data.channelId != this.targetChannel){
                        client.login(data.token)
                        this.targetChannel = data.channelId
                        fs.writeFileSync('data.json', JSON.stringify(data))
                    }
    
                  } catch (e) {
                    console.log(e)
                  }
            }

        })

        client.on('ready', () =>{
            console.log('Bot ready')
            const Guilds = client.guilds.cache.map(guild => guild)
            const Channels = Guilds[0].channels.cache.map(guild => guild)
        })
        
        client.on(Events.MessageCreate, message =>{
            if (message.channelId != this.targetChannel) return
            createMessageContent(message)
        })

        async function createMessageContent(message){
            let reply = null;
            try{
                reply = await message.channel.messages.fetch(message.reference.messageId)
            }
            catch (error){
                console.log()
            }

            const content = {
                'authorId': message.author.id,
                'content': message.content,
                'cleanContent': message.cleanContent,
                'username': message.author.username,
                'avatar': message.author.avatarURL(),
                'nickname': message.member.nickname,
                'color': message.member.displayHexColor,
                'messageId': message.id,
                'reference': message.reference,
                'reply': reply ? {
                    'name': reply.member.nickname ?? reply.author.username,
                    'color': reply.member.displayHexColor,
                    'content': reply.cleanContent
                    } : null,
                'attachments': message.attachments.map(
                    attachment => ({
                        "url":attachment.url,
                        "filename":attachment.name,
                        "content_type":attachment.contentType
                    }))
            }

            console.log(content)
            socket.emit('message', content)
            return content
        }
}
    
    login(){
        client.login(this.token)
    }
    
}

module.exports = {Bot}