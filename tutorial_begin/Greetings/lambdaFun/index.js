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
	    		options.speechText += `Let me drop some <emphasis level="moderate">wisdom</emphasis> on you <break strength = "x-strong"/>`; 
	    		getQuote(function(quote,err) {
	    			if (err) {
	    				context.fail(err);
	    			} else {
	    				options.speechText += quote;
	    				options.endSession = true;
	    				context.succeed(buildResponse(options));
	    			}
	    		}); 

	    	} else if (request.intent.name === "ComplimentIntent"){
	    		let name = request.intent.slots.FirstName.value;
	    		options.speechText = `You look amazing ${name}!  Did you do something with your hair?`;
	    		options.endSession = true;
	    		context.succeed(buildResponse(options));

	    	} else if (request.intent.name === "BitchIntent"){
	    		options.speechText = `Yes George, I am your dirty bitch.  How can I please my master?`;
	    		options.endSession = true;
	    		context.succeed(buildResponse(options));

	    	}  else if (request.intent.name === "HairIntent"){
	    		options.speechText = `It's brown.  Duh, I'm not an idiot`;
	    		options.endSession = true;
	    		context.succeed(buildResponse(options));

	    	}   else if (request.intent.name === "LookIntent"){
	    		options.speechText = `George, you already know I think you're very handsome.  I don't know why you ask.`;
	    		options.endSession = true;
	    		context.succeed(buildResponse(options));

	    	} else if (request.intent.name==="SecretIntent"){
	    		let name = request.intent.slots.FirstName.value;
	    		options.speechText = `I have a secret to tell you.  <amazon:effect name="whispered">I really like your friend ${name}</amazon:effect>`;
	    		options.endSession = true;
	    		context.succeed(buildResponse(options));

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