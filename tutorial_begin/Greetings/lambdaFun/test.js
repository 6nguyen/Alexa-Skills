'use strict'

// tests object/value properties and presents it in human friendly UI
var expect = require('chai').expect,  

// testing the file containing handling functions, index.js
lambdaToTest = require('./index')


function Context() {
  this.speechResponse = null;
  this.speechError = null;

  // loading the speechResponse from all succeed calls into rsp
  this.succeed = function(rsp) {
    this.speechResponse = rsp;
    this.done();
  };

  // capturing error message and putting it into rsp
  this.fail = function(rsp) {
    this.speechError = rsp;
    this.done();
  };

}

// Template checks if responses are valid
function validRsp(ctx,options) {
     expect(ctx.speechError).to.be.null;
     expect(ctx.speechResponse.version).to.be.equal('1.0');
     expect(ctx.speechResponse.response).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech).not.to.be.undefined;
     // .to.be.equal('Plain Text'); if Alexa Skill uses plain text output speech type instead of SSML
     // next three lines should be changed accordingly to output speech type
     expect(ctx.speechResponse.response.outputSpeech.type).to.be.equal('SSML');
     expect(ctx.speechResponse.response.outputSpeech.ssml).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
     if(options.endSession) {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.true;
       expect(ctx.speechResponse.response.reprompt).to.be.undefined;
     } else {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.false;
       if (options.outputSpeech) {
         expect(ctx.speechResponse.response.reprompt.outputSpeech).not.to.be.undefined;
         expect(ctx.speechResponse.response.reprompt.outputSpeech.type).to.be.equal('SSML');
         expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
        }
     }

}

// Template checks if cards are valid
// image url's must be https enabled
function validCard(ctx, standardCard) {
     expect(ctx.speechResponse.response.card).not.to.be.undefined;
     expect(ctx.speechResponse.response.card.title).not.to.be.undefined;
     if (standardCard) {
        expect(ctx.speechResponse.response.card.type).to.be.equal('Standard');
        expect(ctx.speechResponse.response.card.text).not.to.be.undefined;
        expect(ctx.speechResponse.response.card.image).not.to.be.undefined;
        expect(ctx.speechResponse.response.card.image.largeImageUrl).to.match(/^https:\/\//);
        expect(ctx.speechResponse.response.card.image.smallImageUrl).to.match(/^https:\/\//);
      } else {
        expect(ctx.speechResponse.response.card.type).to.be.equal('Simple');
        expect(ctx.speechResponse.response.card.content).not.to.be.undefined;
      }
}


// TEMPLATE:  replace 'SlotName', 'slot value', 'intent name' and intent 'type'
var event = {
  session: {
    new: false,
    sessionId: 'session1234',
    attributes: {},
    user: {
      userId: 'usrid123'
    },
    application: {
      applicationId: 'amzn1.echo-sdk-ams.app.1234'
    }
  },
  version: '1.0',
  request: {
    intent: {
      slots: {
        SlotName: {
          name: 'SlotName',
          value: 'slot value'
        }
      },
      name: 'intent name'
    },
    type: 'IntentRequest',
    requestId: 'request5678'
  }
};



// Tests all intents in one go
// mocha test framework has a describe log to add test cases
describe('All intents', function() {
  // ctx object holds the response
  var ctx = new Context();

  // test case for LaunchRequest
  describe('Test LaunchRequest', function() {

      //  before testing any cases, invokes lambda function to have our response ready to add test cases
      // clearing intent and session attributes because the Launch Intent has no intent or session attributes
      // ctx.done called only when we are finished with our lambda function
      before(function(done) {
        event.request.type = 'LaunchRequest';
        event.request.intent = {};
        event.session.attributes = {};
        ctx.done = done;
        lambdaToTest.handler(event , ctx);
      });

    // it blocks are individual checks
    // this block checks for a valid response
     it('valid response', function() {
       validRsp(ctx,{
         endSession: false,
       });
     });

     // this block checks if outputSpeech matches expected outputSpeech.  Can use partial output or full output
     // in this case, for LaunchRequest
     it('valid outputSpeech', function() {
      expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Welcome to Greetings skill/);
     });
    
    // this block checks if repromptSpeech matches expected repromptSpeech (for LaunchRequest)
     it('valid repromptSpeech', function() {
      expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/You can say/);
     });

  });


// TEST CASES FOR ALL INTENTS **************************************************************************
    
    // test case for HelloIntent
    describe(`Test HelloIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'HelloIntent';
          event.request.intent.slots = {
            // Slot Name, can be found in event.json
            FirstName: {
              name: 'FirstName',
              value: 'Tiffany'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

      // Call validRsp function to check if response is valid
      // endSession: false because we expect the response to stay open
       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       // Check if outputSpeech PERFECTLY matches expected outputSpeech
       // use .*value as a slot value placeholder
       // ssml mark ups must match (ie, <amazon:effect name="whispered">...</amazon:effect>)
       // white space must match
       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Hey .*Tiffany. You look good today/);
       });

       // Check if repromptSpeech matches expected repromptSpeech (Edited out because this is template)
       // it('valid repromptSpeech', function() {
       //  expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/.*/);
       // });

    });

    // test case for ComplimentIntent
    describe(`Test ComplimentIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'ComplimentIntent';
          event.request.intent.slots = {
            FirstName: {
              name: 'FirstName',
              value: 'Tiffany'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/You look amazing/);
       });

    });

    // test case for SecretIntent
    describe(`Test SecretIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'SecretIntent';
          event.request.intent.slots = {
            FirstName: {
              name: 'FirstName',
              value: 'Tiffany'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/I have a secret to tell you/);
       });

    });

    // test case for PotatoIntent
    describe(`Test PotatoIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'PotatoIntent';
          event.request.intent.slots = {
            FirstName: {
              name: 'FirstName',
              value: 'Tiffany'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Doesn't .*Tiffany look like/);
       });

    });


    // test case for ThreatIntent
    describe(`Test ThreatIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'ThreatIntent';
          event.request.intent.slots = {
            FirstName: {
              name: 'FirstName',
              value: 'Tiffany'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Listen up .*Tiffany. /);
       });

    });


    // test case for BitchIntent
    describe(`Test BitchIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'BitchIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Yes George, I am your /);
       });

    });

    // test case for HairIntent
    describe(`Test HairIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'HairIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/It's brownish black.  Duh/);
       });

    });


    // test case for LookIntent
    describe(`Test LookIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'LookIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/George, you already know /);
       });

    });


    // test case for CloseIntent
    describe(`Test CloseIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'CloseIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: true
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/It was a pleasure serving you/);
       });

    });

    
    // test case for QuoteIntent
    describe(`Test QuoteIntent`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'QuoteIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Would you like to hear /);
       });

       //Check if repromptSpeech matches expected repromptSpeech (Edited out because this is template)
       it('valid repromptSpeech', function() {
        expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/You can say/);
       });

      });

    
    // test case for NextQuoteIntent when invoked properly
    describe(`Test NextQuoteIntent proper invocation`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = ctx.speechResponse.sessionAttributes;
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'NextQuoteIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: false
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/How about one more /);
       });

       // Check if repromptSpeech matches expected repromptSpeech (Edited out because this is template)
       it('valid repromptSpeech', function() {
        expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/You can say/);
       });

      });


    
    // test case for NextQuoteIntent when invoked properly
    describe(`Test NextQuoteIntent incorrect invocation`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'NextQuoteIntent';
          event.request.intent.slots = {};
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: true
         });
       });

       it('valid outputSpeech', function() {
        expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/I haven't even told /);
       });

     });




});
