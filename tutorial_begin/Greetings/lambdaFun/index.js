'use strict';

var http = require("http");

// create a mandatory handler function
// export it so it's visible to the lambda service
exports.handler = function(event, context){
	try {

		// if NODE_DEBUG_EN =1, then print request, options, and response
		// 'env NODE_DEBUG_EN = 1' 
		if (process.env.NODE_DEBUG_EN){
			console.log("Request: \n" + JSON.stringify(event, null, 2));
		}
		var request = event.request;
		var session = event.session;

		// if any intent contains a follow-up intent, must use this.
		// intent handlers must use session as an argument (see handlers below)
		if (!event.session.attributes) {
			event.session.attributes = {};
		}

		/*
		1) 3 types of requests
	    i)   LaunchRequest       Ex: "Open greeter"
	    ii)  IntentRequest       Ex: "Say hello to John" or "ask greeter to say hello to John"
	    iii) SessionEndedRequest Ex: "exit" or error or timeout 
	    */
	    if (request.type === "LaunchRequest") {
	    	handleLaunchRequest(context);
	    } else if (request.type === "IntentRequest") {

	    	if (request.intent.name === "HelloIntent"){
	    		 handleHelloIntent(request, context);

	    	} else if (request.intent.name === "ComplimentIntent"){
	    		handleComplimentIntent(request, context);

	    	} else if (request.intent.name === "BitchIntent"){
	    		handleBitchIntent(context);

	    	}  else if (request.intent.name === "HairIntent"){
	    		handleHairIntent(context);

	    	}   else if (request.intent.name === "LookIntent"){
	    		handleLookIntent(context);

	    	} else if (request.intent.name==="SecretIntent"){
	    		handleSecretIntent(request, context);

	    	} else if (request.intent.name==="PotatoIntent"){
	    		handlePotatoIntent(request, context);

	    	}  else if (request.intent.name==="ThreatIntent"){
	    		handleThreatIntent(request, context);

	    	} else if (request.intent.name==="QuoteIntent"){
	    		handleQuoteIntent(request, context, session);

	    	} else if (request.intent.name==="NextQuoteIntent"){
	    		handleNextQuoteIntent(request, context, session);

	    	} else if (request.intent.name==="AMAZON.StopIntent" || request.intent.name==="AMAZON.CancelIntent"){
	    		context.succeed(buildResponse({
	    			speechText: "Good bye.",
	    			endSession: true
	    		}));

	    	} else if (request.intent.name==="CloseIntent"){
	    		handleCloseIntent(context);

	    	} else {
	    		throw "Unknown intent name";
	    	}

	    } 
	    else if (request.type === "SessionEndedRequest") {

	    } else {
	    	throw "Unknown intent type.";
	    }
	} catch(e) {
		context.fail("Exception: " + e);
	}
}


// function to extract JSON response
// version and response copied from response.json file
// Remove sessionAttributes and reprompt from response since we're not using them
function buildResponse(options){
	if (process.env.NODE_DEBUG_EN){
		console.log("buildResponse options: \n" + JSON.stringify(options,null,2));
	}

	var response = {
		version: "1.0",
		response: {
		    outputSpeech: {
		      type: "SSML",
		      ssml: "<speak>" + options.speechText + "</speak>"
		    },
	    	shouldEndSession: options.endSession
	  	}
	};

	if(options.repromptText){
		response.response.reprompt = {
			outputSpeech: {
				type: "SSML",
				ssml: "<speak>"+ options.repromptText + "</speak>"
			}
		};
	}

// if response has a card, create a Simple card
	if (options.cardTitle) {
		response.response.card = {
			type: "Simple",
			title: options.cardTitle
		}
		if (options.imageUrl) {
			response.response.card.type = "Standard";
			response.response.card.text = options.cardContent;
			response.response.card.image = {
				smallImageUrl: options.imageUrl,
				largeImageUrl: options.imageUrl
			};
		} else {
			response.response.card.content = options.cardContent;
		}
	}

	if (options.session && options.session.attributes){
		response.sessionAttributes = options.session.attributes;
	}

	if (process.env.NODE_DEBUG_EN){
		console.log("Response: \n" + JSON.stringify(response, null, 2));
	}

	return response;
}


function getQuote(callback) {
	var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json";
	var req = http.get(url, function(res) {
		var body = "";

		res.on("data", function(chunk) {
			body += chunk;
		});

		res.on("end", function() {
			body = body.replace(/\\/g, "");
			var quote = JSON.parse(body);
			callback(quote.quoteText);
		});
	});

	req.on("error", function(err) {
		callback("", err);
	});
}

// Gets the time of day to wish good morning, afternoon, or eveneing
// getUTCHours - 8 is based on our current Pacific Timezone
function getWish() {
	var myDate = new Date();
	var hours = myDate.getUTCHours() - 8;
	if (hours < 0){
		hours = hours+24;
	}
	if (hours < 12) {
		return "on this beautiful morning. ";
	} else if (hours < 18) {
		return "on this wonderful afternoon. ";
	} else {
		return "on this starry night. ";
	}
}


// Intent Handler code
function handleLaunchRequest(context){
	let options = {};
	options.speechText = "Welcome to Greetings skill. Does anyone need a warm welcome?",
	options.repromptText= "You can say, John is here.",
	options.endSession= false;
	context.succeed(buildResponse(options));
}

function handleHelloIntent(request, context) {
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = "Hey " + name + ". You look good today ";
	options.speechText += getWish(); 
	options.speechText += `Let me drop some <emphasis level="moderate">wisdom</emphasis> on you <break strength = "x-strong"/>`; 
	// Create card title
	options.cardTitle = `Hey ${name}!`;
	
	getQuote(function(quote,err) {
		if (err) {
			context.fail(err);
		} else {
			options.speechText += quote;
			// create card content and image
			options.cardContent = quote;
			//options.imageUrl = "https://c1.staticflickr.com/2/1542/23814666953_51c735fe74_b.jpg";
			options.imageUrl = "https://s-media-cache-ak0.pinimg.com/736x/db/1a/1a/db1a1a6acacd20cbd1bdaaec26b46f12.jpg";

			options.endSession = false;
			context.succeed(buildResponse(options));
		}
	});
}

function handleComplimentIntent(request, context){
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = `You look amazing ${name}!  Did you do something with your hair?`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleSecretIntent(request, context){
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = `I have a secret to tell you.  <amazon:effect name="whispered">I really like your friend ${name}</amazon:effect>`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handlePotatoIntent(request, context){
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = `Doesn't ${name} look like a potato?  I think so.`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleThreatIntent(request, context){
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = `Listen up ${name}.  <amazon:effect name="whispered">I will find you.  And when I do.  I <emphasis level="strong"> will kill you.</emphasis></amazon:effect>`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

// Testing: swear words are censored
function handleBitchIntent(context){
	let options = {};
	options.speechText = `Yes George, I am your little bitch.  How can I please my master?`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleHairIntent(context){
	let options = {};
	options.speechText = `It's brownish black.  Duh, I'm not an idiot`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleLookIntent(context){
	let options = {};
	options.speechText = `George, you already know I think you're very handsome.  I don't know why you ask.`;
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleCloseIntent(context){
	let options = {};
	options.speechText = `It was a pleasure serving you and your guests George.  Can't wait to talk again`;
	options.endSession = true;
	context.succeed(buildResponse(options));
}

function handleQuoteIntent(request, context, session){
	let options = {};
	options.session = session;

	getQuote(function(quote, err) {
		if (err) {
			context.fail(err);
		} else {
			options.speechText = quote;
			options.speechText += " Would you like to hear another quote?";
			options.repromptText = "You can say. yes. or more. ";
			options.session.attributes.QuoteIntent = true;
			options.endSession = false;
			context.succeed(buildResponse(options));
		}
	});
	
}

function handleNextQuoteIntent(request, context, session) {
	let options = {};
	options.session = session;

	if (session.attributes.QuoteIntent) {
		getQuote(function(quote,err){
		if (err) {
			context.fail(err);
		} else {
			options.speechText = quote;
			options.speechText += " How about one more quote?";
			options.repromptText = "You can say. yes.  or more."
			options.endSession = false;
			context.succeed(buildResponse(options));
		}
		});
	} else {
		options.speechText = "I haven't even told you a quote yet though";
		options.endSession = true;
		context.succeed(buildResponse(options));

	}
}