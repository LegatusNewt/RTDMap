const express = require('express'),
    router = express.Router(),
    proto = require('protobufjs'),
    gtfs = require('gtfs-realtime-bindings'),
    request = require('request'),
    GeoJSON = require('geojson'),
    fs = require('fs');

/* GET Data */
router.get('/', fromFile); 
function fromFile(req, res, err) {
    let vehicleArray = { 'type' : 'FeatureCollection', 'features' : [] };
    fs.readFile(`${appRoot}/proto/VehiclePosition.pb`, function(err, message) {            
        let feed = gtfs.transit_realtime.FeedMessage.decode(message)
        //let VehiclePosition = type.decode(message);        
        feed.entity.forEach(function(entity) {
            if (entity.vehicle.position) {
                let vehicle = GeoJSON.parse(entity.vehicle, {Point: ['position.latitude','position.longitude']});
                vehicleArray.features.push(vehicle);
            }
        });                     
        return res.status(200).send(vehicleArray);
    });   
}


router.get('/feed', fromFeed);
function fromFeed(req, res, err) {
    let vehicleArray = { 'type' : 'FeatureCollection', 'features' : [] };
    let requestSettings = {
        method: 'GET',
        url: 'http://googlefeeder.rtd-denver.com/google_sync/VehiclePosition.pb',
        auth: {
            user: 'RTDgtfsRT',
            password: 'realT!m3Feed',
        },
        encoding: null
    }

    request(requestSettings, function (error, response, body){
        if (!error && response.statusCode == 200) {
            let feed = gtfs.transit_realtime.FeedMessage.decode(body)
            //let VehiclePosition = type.decode(message);        
            feed.entity.forEach(function(entity) {
                if (entity.vehicle.position) {
                    let vehicle = GeoJSON.parse(entity.vehicle, {Point: ['position.latitude','position.longitude']});
                    vehicleArray.features.push(vehicle);
                }
            });                     
            return res.status(200).send(vehicleArray);
        }
    });
}



module.exports = router;
