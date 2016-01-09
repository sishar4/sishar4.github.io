var fs = require('fs');
var ejs = require('ejs');


var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync("email_template.html", "utf8");


var friends = csvParse(csvFile);
console.log(friends);

//CREATE CUSTOM EMAIL FOR EACH FRIEND
friends.forEach(function createTemplate(friendObj) {
	var customizedTemplate = ejs.render(emailTemplate, {
		firstName: friendObj.firstName,
		numMonthsSinceContact: friendObj.numMonthsSinceContact
	});

	console.log(customizedTemplate);
});


function csvParse(csvFile) {
	var stringsArray = [];
	var objectsArray = [];
	var numOfLines = 0;
	var indexOfNewLine = 0;

	/*
	PARSE THE SEPARATE STRINGS FROM THE CSV FILE
	*/
	for (var i = 0; i < csvFile.length; i++) {
		if (csvFile[i] === '\n') {
			var contactString = csvFile.substring(indexOfNewLine+1, i);
			//console.log(contactString);
			if (numOfLines > 0) {
				stringsArray.push(contactString);
			}
			numOfLines++;
			indexOfNewLine = i;
		}
	}
	//console.log(stringsArray);
	/*
	SEPARATE EACH STRING INTO ARRAY OF ITS PARTS
	*/
	stringsArray.forEach(function(contactInfo) {
		contact = contactInfo.split(",");
		//console.log(contact);

		/*
		CONVERT ARRAY OF VALUES INTO AN OBJECT
		*/
		var contactObject = {
			firstName: contact[0],
			lastName: contact[1],
			numMonthsSinceContact: contact[2],
			emailAddress: contact[3]
		};

		objectsArray.push(contactObject);
	}); 

	return objectsArray;
}



