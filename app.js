const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  // console.log(__dirname+'/signup.html');
  res.sendFile(__dirname+'/signup.html');
})

app.post("/", function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
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
    }

    var jsonData = JSON.stringify(data);

    var options = {
      url: "https://us20.api.mailchimp.com/3.0/lists/276c932ef9",
      method: "POST",
      headers: {
        "Authorization": "KumarBV ebec935cb0ce25abdf419397fc010fbb-us20"
      },
      body: jsonData
    }

    request(options, function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        // console.log(response.statusCode);
        if (response.statusCode === 200) {
          res.sendFile(__dirname+'/success.html')
        } else {
          res.sendFile(__dirname+'/failure.html')
        }
      }
    })
    console.log(`${firstName} ${lastName} ${email}`)
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})
// https://usX.api.mailchimp.com/3.0/lists/{list_id}
// Mailchimp's API Key
// ebec935cb0ce25abdf419397fc010fbb-us20
// 276c932ef9 <- Unique ID for the mailing list


// Heroku port -> process.env.PORT
app.listen(process.env.PORT || port, function() {
  console.log('Server up and running, listening on port: '+ port);
})
