const express = require('express'),
    router = express.Router(),
    proto = require('protobufjs'),
    gtfs = require('gtfs-realtime-bindings'),
    request = require('request'),
    GeoJSON = require('geojson'),
    moment = require('moment'),
    mongo = require('../mongo/index.js')
    fs = require('fs').promises;

/**
 * GET a Shape  
 * - shapeId 
 * Default, return top 10 shapes. 
**/
router.get('/shapes', getRouteShape);
async function getRouteShape(req, res, err) {
    let shapeId = req.query.shapeId;
    let client = await mongo.get();
    try{    
        const database = client.db('GTFS');
        const collection = database.collection('Shapes');

        const query = shapeId ? { id: shapeId } : {};
        const shape = await collection.findOne(query);

        return res.status(200).send(shape);    
    } catch(exception) {
        return res.status(500).send(exception);
    }
}

router.get('/', getRoute);
async function getRoute(req, res, err) {
    try {
        let client = await mongo.get();
        const database = client.db('GTFS');
        const collection = database.collection('Routes');
        
        const query = req.query.routeId
        const routes = await collection.find({ agency_id: 'RTD' }).toArray();

        return res.status(200).send(routes);
    } catch(exception) {
        return res.status(500).send(exception);
    }
    return res.status(501).send('Nope dude');
}

router.get('/trips', getTrip);
async function getTrip(req, res, err) {    
    let tripId = req.query.tripId;

    try{
        const query = tripId ? { id: shapeId } : {};
    } catch(exception) {
        return res.status(500).send(exception);
    }
    return res.status(501).send('Nope sir');
}





module.exports = router;
