const AirQualityModel = require('../models/airQuality.model')

exports.insert = (req, res) => {
    let Pollution = {
        "ts" : req.pollution.ts,
        "aqius" : req.pollution.aqius,
        "mainus" : req.pollution.mainus,
        "aqicn" : req.pollution.aqicn,
        "maincn" : req.pollution.maincn
    }

    var data = {}

    data.Result = {
        "Pollution" : Pollution,
        "datetime" : new Date()
    }

    AirQualityModel.createAirQuality(data)
    .then((result) => {
        console.log(result)
        //res.status(201).send({id: result._id});
    });
    
};

exports.read = (req, res) => {
    return AirQualityModel.listAirQuality()
    
};