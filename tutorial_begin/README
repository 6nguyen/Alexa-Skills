
1) 3 types of requests
    i)   LaunchRequest       Ex: "Open greeter"
    ii)  IntentRequest       Ex: "Say hello to John" or "ask greeter to say hello to John"
    iii) SessionEndedRequest Ex: "exit" or error or timeout

2) Example Request:
{
  "session": {
    "new": false,
    "sessionId": "session1234",
    "attributes": {},
    "user": {
      "userId": "usr123"
    },
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.5acba9b5-6d09-4444-aaa8-618c56eb0335"
    }
  },
  "version": "1.0",
  "request": {
    "intent": {
      "slots": {
        "FItem": {
          "name": "FItem"
        }
      },
      "name": "GetNutritionInfo"
    },
    "type": "IntentRequest",
    "requestId": "request5678"
  }
}

3) Example response format:
{
  "version": "1.0",
  "sessionAttributes": {
    "supportedHoriscopePeriods": {
      "daily": true,
      "weekly": false,
      "monthly": false
    }
  },
  "response": {
    "outputSpeech": {
      "type": "PlainText",
      "text": "Hello John, Good Morning"
    },
    "card": {
      "type": "Simple",
      "title": "Greetings",
      "content": "Hello John"
    },
    "reprompt": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Can I help you with anything else?"
      }
    },
    "shouldEndSession": true
  }
}

4) Node install procedure for macOS/linux (reference https://github.com/creationix/nvm)
  >> curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
  >> source ~/.bash_profile
  >> nvm install v4.3.2

  For windows, please download node.js from https://nodejs.org/en/download

5) Lambda local setup (https://github.com/ashiina/lambda-local)
  >> npm install -g lambda-local

6) Local testing command
   >> lambda-local -l index.js -h handler -e event.json

7) AWS CLI setup
  >> pip install awscli
  >> Create a user and give permissions at IAM Management console
  >> aws configure

8)
  >> zip -r lambda_upload.zip index.js
  >> aws lambda update-function-code --function-name Greetings --zip-file fileb://lambda_upload.zip

9) SSML (Reference https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference)
   a) audio - lets you provide URL for mp3 file. Can't be more than 90 secs.
      Ex: <audio src="https://carfu.com/audio/carfu-welcome.mp3" /> 

   b) break - Represent pause
      Ex: <break time="3s"/> 
      Ex: <break strength="weak"/> 
   
   c) p - Represent paragraph
      Ex: <p>This is the second paragraph.</p>

   d) say-as - Describes how the text should be interpreted.
      Ex: <say-as interpret-as="cardinal">12345</say-as>
      Ex: <say-as interpret-as="digits">12345</say-as>
      Ex: <say-as interpret-as="spell-out">hello</say-as>

10) Standard Built-in intents
   a) AMAZON.CancelIntent
   b) AMAZON.StopIntent
   c) AMAZON.YesIntent
   d) AMAZON.HelpIntent

11) Installing mocha, chai libraries
   >> export NODE_PATH=~/.nvm/versions/node/v4.3.2/lib/node_modules
   >> npm install -g mocha
   >> npm install -g chai

12) Flask installation
   >> pip install flask

13) curl -H "Content-Type: application/json" --data @event.json http://127.0.0.1:5000/alexa_end_point

14) Heroku steps

  i) Flask run code
    port = int(os.getenv('PORT', 5000))
    print "Starting app on port %d" % port
    app.run(debug=False, port=port, host='0.0.0.0')

  ii) Create Procfile, requirements.txt

  iii) Commands:

    >> git init .
    >> git add .
    >> git commit -m "init" 
    >> heroku create greetingsskill
    >> git remote -v
    >> heroku git:remote -a <name from above step>
    >> git push heroku master
  
  iv) To set env variable in heroku:
    >> heroku config:set GREETINGS_DEBUG_EN=True
    >> heroku config:unset GREETINGS_DEBUG_EN
 
15) Flask ask:
   >> pip install flask-ask

16) Google API links:
    i)   Authorization URL: 
         https://accounts.google.com/o/oauth2/auth?access_type=offline&response_type=code
         (if it doesn't work, add &approval_prompt=force)

    ii)  scopes:
         https://mail.google.com/
         https://www.googleapis.com/auth/gmail.modify
         https://www.googleapis.com/auth/gmail.readonly

    iii) Access token URL:
         https://www.googleapis.com/oauth2/v4/token

17) Modules needed to install
   >> npm install bcryptjs --save
   >> npm install bluebird
   >> export NODE_PATH=~/.nvm/versions/node/v4.3.2/lib/node_modules
   >> npm install -g aws-sdk


