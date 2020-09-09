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

        //Create popup 
        let popup = new mapboxgl.Popup()
            .setHTML('<h3>Oops!</h3><p>You nudged it</p>');

        //Create markers based on coordinates in state
        /*let i = 0;
        state.coordinates.forEach(coord => {
            let marker = new mapboxgl.Marker()
                .setLngLat([coord.x, coord.y])
                .addTo(state.map)
                .setPopup(popup);

            let el = marker.getElement();
            el.id = `${i++}`;
            
            //Add click event to each marker
            el.addEventListener('click', () => {
                this.$store.commit('nudge', el.id);
            });
            state.markers.push(marker);
        });        
        */

        state.map.on('load', () => {
            state.map.loadImage('./tram-black.png', function (error, image) {
                if (error) throw error;
                state.map.addImage('tram-black', image);
            });
            state.map.loadImage('./bus-black.png', function (error, image) {
                if (error) throw error;
                state.map.addImage('bus-black', image);
            });
            axios.get('http://192.168.0.197:3000/data')
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
        });

        state.map.on('click', 'GTFS', e => {
            this.$store.commit('showTargetDeets', JSON.parse(e.features[0].properties.vehicle).id);
        });
    }
};
</script>
