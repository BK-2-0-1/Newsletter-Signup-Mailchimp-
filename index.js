// подключение
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// https.request
const https = require('https');

// ▼▼▼▼ body-parser ▼▼▼▼, теперь его не нужно импортировать отдельно, достаточно написать такой код:
app.use(express.urlencoded({
  extended: true
}));

// ▼▼▼▼ got ▼▼▼▼
const got = require('got');
const { send } = require('process');

// (async () => {
// 	try {
// 		const response = await got('https://sindresorhus.com');
// 		console.log(response.body);
// 		//=> '<!doctype html> ...'
// 	} catch (error) {
// 		console.log(error.response.body);
// 		//=> 'Internal server error ...'
// 	}
// })();


// get
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// post
app.post("/", (req, res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/f5043642c7";

    const options = {
      method: 'POST',
      auth: "BK201:d4550fa45cdf06c687cd00e0b3036c2d-us6"
    };

    const request = https.request(url, options, (response) => {

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on('data', (data) => {
        console.log(JSON.parse(data));
      });

    });

    request.write(jsonData);
    request.end();
});


// failure
app.post("/failure", (req, res) => {
  res.redirect('/');
});

// ▼▼▼▼ подключил css ▼▼▼▼
app.use(express.static(__dirname + '/public'));


// API KEY
// d4550fa45cdf06c687cd00e0b3036c2d-us6

// list id
// f5043642c7