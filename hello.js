/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.


//var dict = require("dict");

var dictTeamMeber = {
    "bob": " He recently turned 50 and I would like to wish him Happy Birthday ",
    "christine" : " She has already started planning year end Party , I didn't get my invite yet ",
    "michael": " He survived a Shark attack this year, Glad that winter is here, so no more beach ",
    "mercury" : " isn't it magnesium now, I tried to be friends with mercury but node 2 is always down "
};


var dictTeamMeberRole = {
    "bob": " He is an Analyst with Data Warehouse Team ",
    "christine" : " She is an Analyst with Data Warehouse Team ",
    "michael": " Mike manages Data Platforms and Mobile team ",
    "mercury" : " Reporting Database  "
};

exports.handler = function (event, context) {
    try {
        //console.log(Object.keys(dictTeamMeber));
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("MyTeamMemberIsIntent" === intentName) {
        setMemberInSession(intent, session, callback);
    } else if ("WhoIsMyTeamMemberIntent" === intentName) {
        getMemberFromSession(intent, session, callback);
    } else if ("HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Hello everyone, nice to meet you,I have heard about most of you,,"
                + "Gaurav, lets see if I know your team, You can say do you know Jon ";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can say do you know Jon "
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the Member in the session and prepares the speech to reply to the user.
 */
function setMemberInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var teamMemberSlot = intent.slots.Member;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    console.log("I am here " + teamMemberSlot.value)
    if (teamMemberSlot && dictTeamMeber[teamMemberSlot.value]) {
        teamMember = teamMemberSlot.value;
        sessionAttributes = createteamMemberAttributes(teamMember);
        speechOutput = "Yes, I know " + teamMember + "," + dictTeamMeber[teamMemberSlot.value]
              + ", You can ask me more about" + teamMember + " by saying, what's my team Member role?";
        repromptText = "You can ask me more about your team Member by saying, what's my team Member role?";
    } else {
        speechOutput = " I'm not sure about your team Member, I think we haven't "
                + "talked about him or her, I would be very much happy to meet, Can we schedule sometime next week? Lets try a different name.";
        repromptText = " Gaurav are you still there? Lets try a different name ";
    }

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createteamMemberAttributes(teamMember) {
    return {
        teamMember: teamMember
    };
}

function getMemberFromSession(intent, session, callback) {
    var cardTitle = intent.name;
    var teamMember;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(session.attributes) {
        teamMember = session.attributes.teamMember;
    }

    if(teamMember) {
        speechOutput = dictTeamMeberRole[teamMember] + ", goodbye";
        shouldEndSession = true;
    }
    else {
        speechOutput =  "I'm not sure about your team Member, I think we haven't "
                + "talked about him or her, I would be very much happy to meet, Can we schedule sometime next week? Lets try a different name.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}
