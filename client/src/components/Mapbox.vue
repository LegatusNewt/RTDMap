<template>
<body>
    <div id="map"></div>
</body>
</template>

<style>

.mapboxgl-popup-content {
    box-shadow: 4px 4px #67EEC3AA;
}

body {
    margin: 0;
    padding: 0;
}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>

<script>
import axios from 'axios'

export default {
    mounted() {
        let state = this.$store.state;
        state.markers = [];

        mapboxgl.accessToken =
            "pk.eyJ1Ijoia2xhbWFyY2EiLCJhIjoiY2p5a3plOTY0MDMydDNpbzNsMDQ3ZWV2cyJ9.EA8hlPf4fj0wLkT0J0ozkA";
        state.map = new mapboxgl.Map({
            container: "map", // container id
            style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
            center: [-104.99, 39.73], // starting position [lng, lat]
            zoom: 10 // starting zoom
        });

        state.map.on('load', () => {
            state.map.loadImage('./tram-black.png', function (error, image) {
                if (error) throw error;
                state.map.addImage('tram-black', image);
            });
            state.map.loadImage('./bus-black.png', function (error, image) {
                if (error) throw error;
                state.map.addImage('bus-black', image);
            });
            axios.get('http://192.168.185.243:3000/data')
                .then(response => {
                    let layer = {
                        id: 'GTFS',
                        type: 'symbol',
                        source: {
                            type: 'geojson',
                            data: null
                        },
                        layout: {
                            'icon-image': '{icon}',
                            visibility: 'visible'
                        }
                    }
                    state.map.addLayer(layer);
                    this.$store.commit('updateLayer', response.data);
                    this.$store.dispatch('update')
                }).catch(err => {
                    console.log(err);
                });                

            axios.get('https://opendata.arcgis.com/datasets/e14366d810644a3c95a4f3770799bd54_4.geojson')
                .then(response => {
                    routeLayer(response);   
                }).catch(err => {
                    console.log(err);
                });
        });

        state.map.on('click', 'GTFS', e => {
            this.$store.commit('showTargetDeets', JSON.parse(e.features[0].properties.vehicle).id);
        });

        state.map.on('click', 'Trips', e=> {
            console.log(`Clicked a route : ${e.id}`);
        });        

        function routeLayer(response) {
            let layer = {
                id: 'Trips',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: response.data
                },
                layout: {
                    visibility: 'visible'
                }
            }
            state.map.addLayer(layer);
        }
    }    
};
</script>
