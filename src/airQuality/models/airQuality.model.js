const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
	Result : {
        Pollution : {
            ts : String,
            aqius : Number,
            mainus : String,
            aqicn : Number,
            maincn : String
        },
        datetime : String
    }
});

const AirQuality = mongoose.model('airqualities', airQualitySchema);

exports.createAirQuality = (data) => {
	const airQuality = new AirQuality(data);
	return airQuality.save();
};

exports.listAirQuality = async () => {
    var results = await AirQuality.find();
    console.log("AIR QUALITY DOCS", results)
    return results
};