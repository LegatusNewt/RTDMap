import Vue from 'vue'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Vuesax from 'vuesax'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import 'material-icons/iconfont/material-icons.css';
import vPopup from './components/MapPopup.vue';
import rModule from './modules/routes.js';
import mModule from './modules/map.js';

Vue.use(Vuesax);
Vue.use(Vuex);
Vue.use(vuetify);

const VuePopup = Vue.extend(vPopup);
const connString = 'http://justinian:3000';

Vue.config.productionTip = false

const store = new Vuex.Store({ 
  modules: {
    rModule: rModule,
    mModule: mModule
  },
  state: {    
    filters: ["all"],
    count: 0,  
    vehicles: [],
    //routes: [],
    //trips: {},
    tripShapes: { type: "FeatureCollection", features: [] },
    geoJson: {},
    coordinates: [
      { x: -104.9293, y: 39.6984},
      { x: -104.9185, y: 39.6874}       
    ]
  },  
  mutations: {
    showTargetDeets (state, vhID) {
      let vh = state.vehicles.find( x => x.id == vhID);
      let coordinates = [vh.position.longitude, vh.position.latitude]
      //tripId is undefined when no route. Shape not in trip object
      let data = { route: vh.trip ? vh.trip.routeId : 'OOS', vehicle: vh.vehicle.label, tripId: vh.trip.tripId, shapeId: vh.trip.shapeId }
      
      const popup = new VuePopup({ store: store, propsData: data });

      const poppy = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<div id="poppy${vhID}"</div>`) //hacky      
      .addTo(state.mModule.map);

      popup.$mount(`#poppy${vhID}`);
      poppy._update();
    },
    targetAquired (state,target) {
      state.mModule.map.flyTo({
        center: [target.position.longitude, target.position.latitude],
        zoom: 15
      });      
      this.commit("showTargetDeets", target.vehicle.id);
    },
    nudge (state, index) {      
      let newX = state.coordinates[index].x + 0.01;
      let newY = state.coordinates[index].y + 0.01;

      Vue.set(state.coordinates, index, { x: newX, y: newY })     
      console.log(state.coordinates[index]);
      
      //Update marker position
      state.markers[index].setLngLat([
        state.coordinates[index].x,
        state.coordinates[index].y
      ]);
    },
    toggleShape(state, data) {
      let currentState = state.tripShapes;
      let index = currentState.features.find( x=> x.id === data.id );      
      let currentFilter = state.filters;
      if(index > -1){
        //This logic is messy.
        if(currentState.features[index].visible == true){
          currentState.features[index].visible = false;
          currentFilter.push(["!=", "id", `${currentState.features[index].id}`]);          
        } else {
          currentState.features[index].visible = true;
          currentFilter.remove( x => { x.includes(`${currentState.features[index].id}`) } );        
        }
        Vue.set(state, 'filters', currentFilter);
        Vue.set(state, 'tripShapes', currentState);
        state.mModule.map.setFilter( 'tripShapes', currentFilter );
      }      
    },
    updateTripShape(state, data) {
      let currentState = state.trips;
      if(currentState.features.findIndex( x => x.id === data.id ) === -1){
        currentState.features.push( { ...data, visible: true } ); //don't know route or trip id yet
      }      
      Vue.set(state, 'tripShapes', currentState);
      state.mModule.map.getSource('Trips').setData(currentState);
    },
    updateVehicles(state, data) {
      //Gather vehicle objects from geoJSON
      let mapVehicles = new Map();
      let listVehicles = [];
      data.features.forEach( feat => {
        let vh = parseVehicle(feat);
        listVehicles.push(vh);
      });
      state.vehicles.splice(0, state.vehicles.length, ...listVehicles);
      //state.geoJson.map(data);
      //Vue.set(state, 'geoJson', data);
      state.mModule.map.getSource('GTFS').setData(data);                  
      console.log('Update');
    }
  },
  actions: {    
    getShape({ commit }, shapeId) {
      axios.get(`${connString}/routes/shapes`, { params: { shapeId : shapeId }} ).then( response => {
        commit('updateTripShape', response.data)
      });
    },
    getVehicles ({ commit }) {
      setInterval(() => {
        axios.get(`${connString}/data`).then( response => {
          commit('updateVehicles', response.data)
        });        
      }, 60000);
    }  
  }
});

new Vue({
  store,
  vuetify,
  render: h => h(App),
  created() {
    this.$store.dispatch('rModule/updateRoutes');  
  }
}).$mount('#app')

function parseVehicle(geoJSON){
  const vObject = {    
    icon: geoJSON.properties.icon,
    id: geoJSON.properties.vehicle.id,
    position: geoJSON.properties.position,
    vehicle: geoJSON.properties.vehicle,
    trip: geoJSON.properties.trip,
    timestamp: new Date().toTimeString()
  };  
  return vObject;
}

