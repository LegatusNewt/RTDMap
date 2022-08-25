const express = require('express'),
    router = express.Router(),
    proto = require('protobufjs'),
    gtfs = require('gtfs-realtime-bindings'),
    request = require('request'),
    GeoJSON = require('geojson'),
    moment = require('moment'),
    fs = require('fs').promises;

const FEED_SETTINGS = { 
    method: 'GET',
    url: 'http://rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
    auth: {
        user: 'RTDgtfsRT',
        password: 'realT!m3Feed',
    },
    encoding: null
};

/* GET Data */
//TODO: clean this up
router.get('/', fromFile);
async function fromFile(req, res, err) {
    let vehicleMeta = req.app.locals.vehicle_Meta;
    if(!vehicleMeta || vehicleMeta.success === false || (vehicleMeta.timestamp && vehicleMeta.timestamp < moment().subtract(1, 'minute').valueOf())){
        let results = await downloadFromFeed();
        console.log(results);
        Object.assign(req.app.locals.vehicle_Meta, results);
    }
    let vehicleArray = { 'type' : 'FeatureCollection', 'features' : [] };
    let message = await fs.readFile(`${appRoot}/proto/VehiclePosition.pb`);
    let feed = gtfs.transit_realtime.FeedMessage.decode(message)
    //let VehiclePosition = type.decode(message);        

    feed.entity.forEach(function(entity) {
        if (entity.vehicle.position) {
            let vehicle = GeoJSON.parse(entity.vehicle, {Point: ['position.latitude','position.longitude']});
            
            //Determine if train or bus?
            if(isNaN(vehicle.properties.vehicle.id)){
                vehicle.properties.icon = 'tram-black';
            } else{
                vehicle.properties.icon = 'bus-black';
            }
            
            vehicleArray.features.push(vehicle);
        }
    });                     
    console.log('Got Data');
    return res.status(200).send(vehicleArray);
}

//Should be For debugging only, disable route in production build
router.get('/feed', fromFeed);
function fromFeed(req, res, err) {
    let vehicleArray = { 'type' : 'FeatureCollection', 'features' : [] };
    request(FEED_SETTINGS, function (error, response, body){
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
        } else{
            console.log(error.message);
            return res.status(500).send(error);
        }
    });
}

//Update local file every 60 seconds
async function downloadFromFeed() {    
    let promise = new Promise( function(resolve, reject) {
        request(FEED_SETTINGS, async function (error, response, body){
            if (!error && response.statusCode == 200) {
                await fs.writeFile(`${appRoot}/proto/VehiclePosition.pb`, body);
                resolve({ success: true, timestamp : moment.now(), error: null });
            }
            else{
                console.log(error.message); //Should add global error handler
                resolve({ success: false , error: error.message });
            }
        });
    });
    let data = await promise;
    console.log('New File');
    return data;
}



module.exports = router;
