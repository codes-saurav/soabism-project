const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const nodemailer = require("nodemailer");
require('dotenv').config();


const app = express();
app.use(express.static('soabism-project'));

app.use(bodyParser.urlencoded({ extended: true }))
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")

})

app.post('/', function(req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    console.log(firstName, lastName, email);


    // Send welcome email
    let HelperOptions = {

        from: process.env.NAME + '<' + (process.env.EMAILID) + '>',
        to: email,
        subject: "Welcome to codes.soabism community",
        html: "Hello " + firstName + " ,<br><h2><b>Welcome to codes.soabism.</b></h2>,<br><br>  <a href=``https://www.youtube.com/channel/UCiQhMPGMvCbBSre4NbZTHIg` target=`__blank` width =`250px` height=`250px` title=`Open in Youtube`><img src=`https://i.postimg.cc/SRBC2k8C/soabism.png` width=`250px` height=`250px`></a>. <br><b>You have successfully signed up for our newsletter</b>.<br> This channel will feature educational content related to <b>coding</b> and <b>technology</b>.In this channel you will find a wide range of courses which have been carefully researched and created to provide comprehensive and in-depth knowledge of all the topics. <br>For more insights, <b>Subscribe to my youtube channel <a href=`https://www.youtube.com/channel/UCiQhMPGMvCbBSre4NbZTHIg`> codes.soabism </a> and get started !.</b><br> Connect with me on <a href =`https://linktr.ee/Sauravraj`>Social networks </a> <br><br>Any suggestions are always welcome.<br>Regards,Saurav Raj"

    };

    transporter.sendMail(HelperOptions, (err, info) => {
        if (err) throw err;
        console.log("The message was sent");
    });

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    var jsonData = JSON.stringify(data);

    const audienceId = process.env.AUDID;

    const url = `https://us5.api.mailchimp.com/3.0/lists/${audienceId}`;

    const apiKey = process.env.APIKEY;

    const options = {
        method: "POST",
        auth: `saurav15:${apiKey}`
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");

        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })

    // 

    request.write(jsonData);
    request.end();



    app.post("/failure", function(req, res) {
        res.redirect("/");
    })
})


const port = process.env.PORT;

app.listen(port || 3000, () => {
    console.log("server is started");
})