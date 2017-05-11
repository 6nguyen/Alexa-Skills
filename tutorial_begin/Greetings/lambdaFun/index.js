'use strict';

var http = require("http");

// create a mandatory handler function
// export it so it's visible to the lambda service
exports.handler = function(event, context){
	try {
		var request = event.request;

		/*
		1) 3 types of requests
	    i)   LaunchRequest       Ex: "Open greeter"
	    ii)  IntentRequest       Ex: "Say hello to John" or "ask greeter to say hello to John"
	    iii) SessionEndedRequest Ex: "exit" or error or timeout 
	    */
	    if (request.type === "LaunchRequest") {
	    	let options = {};
	    	options.speechText = "Welcome to Greetings skill. Does anyone need a warm welcome?",
	    	options.repromptText= "You can say, John is here.",
	    	options.endSession= false;
	    	context.succeed(buildResponse(options));
	    } 
	    else if (request.type === "IntentRequest") {
	    	let options = {};

	    	if (request.intent.name === "HelloIntent"){
	    		let name = request.intent.slots.FirstName.value;
	    		options.speechText = "Hey " + name + ". You look good today ";
	    		options.speechText += getWish(); 
	    		getQuote(function(quote,err) {
	    			if (err) {
	    				context.fail(err);
	    			} else {
	    				options.speechText += quote;
	    				options.endSession = true;
	    				context.succeed(buildResponse(options));
	    			}
	    		}); 

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
// Remove sessionAttributes, card, and reprompt
function buildResponse(options){
	var response = {
		version: "1.0",
		response: {
		    outputSpeech: {
		      type: "PlainText",
		      text: options.speechText
		    },
	    	shouldEndSession: options.endSession
	  	}
	};

	if(options.repromptText){
		response.response.reprompt = {
			outputSpeech: {
				type: "PlainText",
				text: options.repromptText
			}
		};
	}
	return response;
}


function getQuote() {
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
		return "on this beautiful morning.";
	} else if (hours < 18) {
		return "on this wonderful afternoon.";
	} else {
		return "on this starry night.";
	}
}