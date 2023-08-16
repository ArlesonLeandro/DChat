const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

const server = require('./server.js')
const {Bot} = require('./bot.js')

if (fs.existsSync('data.json') != true){
  let data = JSON.stringify({token:'',channelId:''})
  fs.writeFileSync('data.json', data)
}

fs.readFile('data.json', (err, data) =>{
  if (err) throw err;
  let d = JSON.parse(data)

  let b = new Bot({
    token: d.token,
    targetChannel: d.channelId
  })

  console.log(d.channel_id)
  
  b.login(d.token)
})


const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 660,
    height: 600,
    minWidth: 600,
    minHeight: 600,
    icon: path.resolve(__dirname, "./DChat.ico"),
    autoHideMenuBar: true,
    backgroundColor: '#313338'
  })

  mainWindow.loadURL("http://localhost:5000/interface")
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})