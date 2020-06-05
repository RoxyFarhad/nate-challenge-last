const express = require('express');
var validUrl = require('valid-url');
const bodyParser = require('body-parser');
const htmlToText = require('html-to-text');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log(`Listening on port ${port}`));

const parserController = require("./parseText.js")

// create a GET route
app.get('/url', async (req, res) => {

  if(req.query.url.length === 0) { res.status(400).send("Please supply a valid url"); return }

  const url = req.query.url
  if (!validUrl.isUri(url)) { res.status(400).send("Invalid url. Please supply a valid url"); return }

  const textRes = await parserController.parseHtml(url, parseInt(req.query.mode)) 

  if(textRes === 500){ res.status(500).send("Server failed. Please try again.") } 
  else {   res.status(200).send(textRes)  }
});