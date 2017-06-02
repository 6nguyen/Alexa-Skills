from flask import Flask
# create a Flask object by calling the Flask constructor with __name__
# __name__ is the name of the main function
app = Flask(__name__)

''' 
Wrapper function uses Flask's route method on app to wrap the function defined 
below in a web-app-friendly path (url).  ie, typing www.google.com in your 
browser actually directs you to www.google.com/
This function runs a web service on a given IP address (locally hosted) and
prints the message onto the screen
'''
@app.route("/")
def hello():
	return "Congratulations!  The file you opened is running a locally hosted web service on the given IP address (found in the url path above)."

# makes sure we're running the correct file, not another file w/ same name (? unclear)
if __name__ == "__main__":
	app.run()