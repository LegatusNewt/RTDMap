const express = require('express'),
    router = express.Router(),
    proto = require('protobufjs');

/* GET Data */
router.get('/', function(req, res, next) {
    console.log(__dirname);
    let fileIn = proto.load(`${appRoot}/VehiclePosition.pb`, function(err, root) {
        if(err){
            return res.status(500).send({
                message : 'Something went wrong'
            });
        } 
        console.log(root);
        return res.status(200).send(root);
    });
});

module.exports = router;
