const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodeCron = require('node-cron')

const AirQualityController = require('./airQuality/controllers/airQuality.controller')

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const url = 'mongodb+srv://ayoann12:IamHighlyfavored2022@cluster0.nftcd.mongodb.net'
const dbName = 'YassirApp';
const uri = url + '/' + dbName + '?retryWrites=true&w=majority'

// defining the Express app
const app = express();


// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


mongoose.connect(uri, { useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


// CRON Job
const job = nodeCron.schedule("* * * * *", () => {
  console.log(new Date().toLocaleString());
  $.getJSON('https://api.airvisual.com/v2/nearest_city?lat=48.856613&lon=2.352222&key=bcfb1185-4272-42ba-8af9-7be06401fa15',
  function(data) {
    //console.log(data)

    var req = data.data.current

    AirQualityController.insert(req)
  });
});

// Integration
app.get('/airquality/:longitude/:latitude', (req,res) => {
  $.getJSON('https://api.airvisual.com/v2/nearest_city?lat=' + req.params.latitude + '&lon=' + req.params.longitude + '&key=bcfb1185-4272-42ba-8af9-7be06401fa15',
  function(data) {
      console.log(data.data.current)
      
      let Pollution = {
          "ts" : data.data.current.pollution.ts,
          "aqius" : data.data.current.pollution.aqius,
          "mainus" : data.data.current.pollution.mainus,
          "aqicn" : data.data.current.pollution.aqicn,
          "maincn" : data.data.current.pollution.maincn
      }

      let result = {}

      result.Result = {
          "Pollution" : Pollution
      }
      console.log(result)

      res.status(201).send(result)
      
  });
})

// Get database results from Paris CRON job
app.get('/airquality/paris', (req,res) => {

  AirQualityController.read()
  .then((results) => {
    console.log(results)
    res.status(201).send(results)
  })
  
      
  
})
// Démarrer le serveur
app.listen(3001, () => {
  console.log('listening on port 3001');
});

/*
MongoClient.connect(url, function(err, client) {
  console.log("Connecté à MongoDB");
  const db = client.db(dbName);
  client.close();

  // CRON Job
  const job = nodeCron.schedule("* * * * *", () => {
    console.log(new Date().toLocaleString());
    $.getJSON('https://api.airvisual.com/v2/nearest_city?lat=48.856613&lon=2.352222&key=bcfb1185-4272-42ba-8af9-7be06401fa15',
    function(data) {
      //console.log(data)

      var req = data.data.current

      AirQualityController.insert(req)
    });
  });

  // Integration
  app.get('/airquality/:longitude/:latitude', (req,res) => {
    $.getJSON('https://api.airvisual.com/v2/nearest_city?lat=' + req.params.latitude + '&lon=' + req.params.longitude + '&key=bcfb1185-4272-42ba-8af9-7be06401fa15',
    function(data) {
        console.log(data.data.current)
        
        let Pollution = {
            "ts" : data.data.current.pollution.ts,
            "aqius" : data.data.current.pollution.aqius,
            "mainus" : data.data.current.pollution.mainus,
            "aqicn" : data.data.current.pollution.aqicn,
            "maincn" : data.data.current.pollution.maincn
        }

        let result = {}

        result.Result = {
            "Pollution" : Pollution
        }
        console.log(result)

        res.status(201).send(result)
        
    });
  })

  // Get database results from Paris CRON job
  app.get('/airquality/paris', (req,res) => {

    db.collection('airQualities').find().toArray()
    .then(results => {
      console.log(results)
      res.status(201).send(results)
    })
    .catch(error => console.error(error))
        
    
  })
  // Démarrer le serveur
  app.listen(3001, () => {
    console.log('listening on port 3001');
  });
});
*/

