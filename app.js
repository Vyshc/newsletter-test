const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const https = require("node:https");

const app = express();

app.use(express.static("public")); //access files inside by using a relative path (relative to public folder)
app.use(bodyParser.urlencoded({ extended: true }));

client.setConfig({
    apiKey: "14c1ac886f389c095217fc9b88c93e15-us12",
    server: "us12",
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const dataFirstName = req.body.first;
  const dataSecondName = req.body.second;
  const dataMail = req.body.mail;

  //async function returns a Promise Object. Promise Object is like a container yet to be filled.
  const run = async () => {
    //await keyword allows for the other code to run while the async function waits for the value to be filled in the promise object
    try{
    const response = await client.lists.batchListMembers("e0df8318eb", {
      members: [
        {
          email_address: dataMail,
          status: "subscribed",
          merge_fields: {
            FNAME: dataFirstName,
            LNAME: dataSecondName,
          },
        },
      ],
    })
    res.sendFile(__dirname + "/success.html");
}
    // .then((request) =>{ 
    //     
    // })
    catch(error){
        console.log(error.status);
        res.sendFile(__dirname + "/failure.html");
    }
  };

  run();

});

app.post("/failure.html", (req, res)=>{
    res.redirect("/");
});
