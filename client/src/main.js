import Vue from 'vue'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Vuesax from 'vuesax'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import 'material-icons/iconfont/material-icons.css';
import vPopup from './components/MapPopup.vue';

Vue.use(Vuesax);
Vue.use(Vuex);
Vue.use(vuetify);

const VuePopup = Vue.extend(vPopup);
const connString = 'http://192.168.0.197:3000';

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    count: 0,  
    vehicles: [],
    routes: { type: "FeatureCollection", features: [] },
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
      let data = { route: vh.trip ? vh.trip.routeId : 'OOS', vehicle: vh.vehicle.label }
      
      const popup = new VuePopup({ store: store, propsData: data });

      const poppy = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`${popup.innerHTML}<div id="poppy${vhID}"</div>`) //hacky      
      .addTo(state.map);

      popup.$mount(`#poppy${vhID}`);
      poppy._update();
    },
    targetAquired (state,target) {
      state.map.flyTo({
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
    updateRoutes(state, data) {
      let currentState = state.routes;
      currentState.features.push( data ); //don't know route or trip id yet      
      Vue.set(state, 'Routes', currentState);
      state.map.getSource('Routes').setData(currentState);
    },
    updateLayer(state, data) {
      //Gather vehicle objects from geoJSON
      let mapVehicles = new Map();
      let listVehicles = [];
      data.features.forEach( feat => {
        let vh = parseVehicle(feat);
        listVehicles.push(vh);
      });
      state.vehicles.splice(0, state.vehicles.length, ...listVehicles);
      //state.geoJson.map(data);
      Vue.set(state, 'geoJson', data);
      state.map.getSource('GTFS').setData(data);      
      console.log('Update');
    }
  },
  actions: {
    getShape({ commit }) {
      axios.get(`${connString}/routes/shape/1`).then( response => {
        commit('updateRoutes', response.data)
      });
    },
    update ({ commit }) {
      setInterval(() => {
        axios.get(`${connString}/data`).then( response => {
          commit('updateLayer', response.data)
        });        
      }, 60000);
    }
  }

});

new Vue({
  store,
  vuetify,
  render: h => h(App)
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

