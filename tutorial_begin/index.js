/*
 * This is a node.js tutorial
 *
 */

var firstName; 
firstName = "John";

/*if (firstName === "John" || firstName === "James") {
	console.log("Hello " + firstName);
} else {
	console.log("Hello uknown");
}*/

// Creating an array, populating it, and printing it.  
// Variable.length doesn't have parameter parenthesis like in Java.
var myArr = [1,2,3,true,"john"];

/*for (var i=0; i<myArr.length; i++){
	console.log(i + "th element is " + myArr[i]);
}
*/
// js backstring functionality is not a single quote!
// it's a [ ` ] , the lowercase tilda [ ~ ]
/*console.log("\nAlternatively, myArr can be printed using back String")
for (var i=0; i<myArr.length; i++){
	console.log(`${i}th element is ${myArr[i]}`);
}*/


function sayHi(name){
	console.log(`\nHi ${name}\n`);
}

/*sayHi("Jimmy");*/

function callHi(func, name){
	func(name);
}
/*console.log("Calling a function to call the sayHi function.\n");
callHi(sayHi, "Jasper");*/


// Creating an object that contains even a function
var person1 = {
	name: "George",
	title: "Mr. ",
	city: "Chicago",
	getName: function() {
		return this.title + this.name;
	}
};
console.log(person1.getName());

// creating a function with an Object constructor
// Objects are UpperCaseCamel
function Person(name, title, city){
	this.name = name;
	this.title = title;
	this.city = city;
	this.getName = function(){
		return this.title + this.name;
	}
}
var person2 = new Person("Jessica", "Ms. ", "Santa Ana");
console.log(person2.getName());


// importing a model; fs allows file reading
console.log("====================");
var fs = require("fs");
/* 
 * Code blocks must be surrounded by try catch blocks.  If not,
 * execution stops at the error and lines following aren't reached.
 *
 * Non-Blocking method (callback functions) can catch an error AND allows
 * code to be executed based on when they finish.
 */
try{
	var data = fs.readFileSync("./tempFile.txt", "utf8");
	//console.log(data);
} catch(err){
	console.log(err);
}


// Callback functions allow for code blocks to run out-of-line
console.log("Non-Blocking functions: \n" 
		+ "fs.readFile executes when it is finished reading a file, " 
		+ "allowing other calls to be made before it finishes.\n");
// Including err as a parameter logs an error message if the file can't be found
fs.readFile("./tempFile.txt", "utf8", function(err, file){
	console.log(err);
	console.log("\n" + file);
});
console.log('This line executed immediately, before fs.readFile is done.');
