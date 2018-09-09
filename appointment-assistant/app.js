var builder = require('botbuilder');
var restify = require('restify');

/*
Bot Framework Connecters: 2 types - They are services used to connect to chat channels (skype, slack, teams).
Console Conencter - Used to connect bot to a terminal. This is useful for development and testing.
*/

// Console connecter
var connector = new builder.ConsoleConnector().listen();
// Used to send and recive information to the bot.
// Default dialog handler - Informing message from user will trigger this message.
var bot = new builder.UniversalBot(connector, function(session) {
    session.send("Hello there. you said: " + session.message.text);
}); 

// Chat Connecter - Used to connect us to skype, facebook and slack.