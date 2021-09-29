
require('dotenv').config();
//import the express library 
const express = require('express');
const { halloweenCharacters } = require('./data/halloween.js');
//because the docs say so, we call express to get a thing called app
const app = express(); 
const cors = require('cors');
//we need cors always, it makes it so other sites can hut our API. 
app.use(cors()); 

app.get('/halloween-characters', (req, res) => {
  // Sending a response back to whoever is calling
  res.json(halloweenCharacters);
});

//just like React Router, we can put data in the URL with a colon and grab it later
app.get('/halloween-characters/:id', (req, res)=> {
  const matchingHalloweenCharacter = halloweenCharacters.find(character => character.id === Number(req.params.id)); 
  res.json(matchingHalloweenCharacter); 
}); 

module.exports = { app };