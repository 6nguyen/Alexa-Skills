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
     // next two lines should be changed accordingly to output speech type
     expect(ctx.speechResponse.response.outputSpeech.type).to.be.equal('SSML');
     expect(ctx.speechResponse.response.outputSpeech.ssml).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
     if(options.endSession) {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.true;
       expect(ctx.speechResponse.response.reprompt).to.be.undefined;
     } else {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.false;
       expect(ctx.speechResponse.response.reprompt.outputSpeech).to.be.not.undefined;
       expect(ctx.speechResponse.response.reprompt.outputSpeech.type).to.be.equal('SSML');
       expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
     }

}

// Template checks if cards are valid
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




describe('All intents', function() {
  var ctx = new Context();


  describe('Test LaunchIntent', function() {

      before(function(done) {
        event.request.type = 'LaunchRequest';
        event.request.intent = {};
        event.session.attributes = {};
        ctx.done = done;
        lambdaToTest.handler(event , ctx);
      });


     it('valid response', function() {
       validRsp(ctx,{
         endSession: false,
       });
     });

     //it('valid outputSpeech', function() {
     //  expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Hi,.*<\/speak>/);
     //});
    
     //it('valid repromptSpeech', function() {
     //  expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>For example.*<\/speak>/);
     //});

  });

    describe(`Test TBDIntentName`, function() {

        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'TBDIntentName';
          event.request.intent.slots = {
            TBDSlotName: {
              name: 'TBDSlotName',
              value: 'TBDValue'
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, {
           endSession: TBD
         });
       });

       //it('valid outputSpeech', function() {
       //  expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Hi,.*<\/speak>/);
       //});
    
       //it('valid repromptSpeech', function() {
       //  expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>For example.*<\/speak>/);
       //});

    });


});
