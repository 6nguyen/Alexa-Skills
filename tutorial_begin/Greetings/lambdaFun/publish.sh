\rm -fr lambda_upload.zip
zip -r lambda_upload.zip index.js
aws lambda update-function-code --function-name WelcomeSkill --zip-file fileb://lambda_upload.zip