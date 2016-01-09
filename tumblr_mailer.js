var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var client = tumblr.createClient({
  consumer_key: 'DjlEjtPAh1ihsdic9POe643AShz2vV93bw0z5XKiJPTERm5dUk',
  consumer_secret: 'nFQOgXem2yZJsxmoOkuqvLVRUMQhjn22QrxJxnJ13pDvX8ZAlT',
  token: 'XnSEMvNPAanTuai49C38yq1K5u02ulMagmnbMOSnaOiLiQASqj',
  token_secret: 'yScFAhPfDpzRwIRKSTynNJG8vDQBTrzuWwvHzOG3uH4su00u03'
});

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync("email_template.ejs", "utf8");

var friends = csvParse(csvFile);


client.posts('sishar4.tumblr.com', function(err, blog){
	var latestPosts = getLatestPosts(blog.posts);

	//CREATE CUSTOM EMAIL FOR EACH FRIEND
	friends.forEach(function createTemplate(friendObj) {
		var customizedTemplate = ejs.render(emailTemplate, {
			firstName: friendObj.firstName,
			numMonthsSinceContact: friendObj.numMonthsSinceContact,
			latestPosts: latestPosts
		});

		console.log(customizedTemplate);
	});
});

function getLatestPosts(posts) {
	var postsFromPastWeek = [];
	var currentDate = new Date();

	for (var i = 0; i < posts.length; i++) {
		var postDate = new Date(posts[i].date);
		var timeDiff = Math.abs(currentDate.getTime() - postDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		if (diffDays <= 7) {
			postsFromPastWeek.push(posts[i]);
		}
	}
	return postsFromPastWeek;
}

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



