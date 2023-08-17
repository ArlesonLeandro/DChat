# DChat: Discord Chat Overlay Guide
DChat is a straightforward Discord chat overlay designed for use with OBS and other similar software.

### Configuration Guide
To get started, you'll need to create a Discord bot. Go to [Discord Dev Portal](https://discord.com/developers/applications) and click on "New Application."

### Bot Configuration
In the "Bot" tab of your application, check the following two options:

![image](https://github.com/ArlesonLeandro/DChat/assets/54123341/495a1dab-40e3-440d-8ea7-70b0b6f30bbc)

### Inviting the Bot
In the "OAuth2" -> "URL Generator" tab, select "bot" under "Scopes," and then select "Administrator" under "Bot Permissions."

Copy the generated link and use it to invite the bot to your Discord server.

### Obtaining Bot Token and Channel ID
In the "Bot" tab of your application, click on "Reset Token" and then copy the newly generated token.

Next, open the Discord app and activate "Developer Mode" in the advanced settings. Right-click on the channel you want to listen to and copy the channel ID.

### Configuring the DChat App
With the DChat app open, click the button located in the top-right corner of the window. Enter the token and channel ID you obtained earlier, and then click "Apply."
After completing the configuration, the DChat overlay will be hosted at http://localhost:5000/.
