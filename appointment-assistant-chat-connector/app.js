var builder = require('botbuilder');
var restify = require('restify');

/*
Chat Connecter - Used to connect us to skype, facebook and slack.
*/

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Console connecter
var connector = new builder.ChatConnector();

// Connect chat connector to restify
server.post('/api/messages', connector.listen());

// Used to send and recive information to the bot.
// Default dialog handler - Informing message from user will trigger this message.
var bot = new builder.UniversalBot(connector, function(session) {
    session.send("Hey there! I'm a virtaul assistant. I can help you book a medical appointment with us. " + 
                 "Please provide answers to the following questions.");
    session.beginDialog('setAppointment');
}); 


// Dialogs are used to monitor conversations and manage the conversations flow.
// A conversation is defined as a communication between a bot adn a user to one 
// or more dialogs. Below dialog uses the waterfall model which is a simple way
// to model and manage the conversation flow.
bot.dialog('setAppointment', [(session, args, next) => {
    // bot can expecte different value types (text, number, choice).
    builder.Prompts.text(session, "What is your name?");
}, (session, results) => {
    // Lets store the session data of the users response
    session.userData.name = results.response;
    builder.Prompts.number(session, "Great! Whats your age?");
}, (session, results) => {
    // Lets store the session data of the users response
    session.userData.age = results.response;
    builder.Prompts.choice(session, "Ok, Whats your gender?", ["Male", "Female"]);
}, (session, results) => {
    // Lets store the session data of the users response
    session.userData.gender = results.response.entity;
    // Collect appointment time
    builder.Prompts.time(session, "When would you like to have an appointment? You can say " +
        "'tomorrow 10 am or date and in m/d/yy hh:mm'");
    }, (session, results) => {
    session.userData.datetime = builder.EntityRecognizer.resolveTime([results.response]);

    // Lets print the data now.
    var data = session.userData;
    session.send("Thank you for your time. I have booked an appointment for you at " + session.userData.datetime);
    session.send("Appointment Details: \nName: " + data.name + "\nAge: " + data.age + "\nGender: " + data.gender);
}]);


