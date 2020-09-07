import Vue from 'vue'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Vuesax from 'vuesax'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import vuetify from './plugins/vuetify';

Vue.use(Vuesax);
Vue.use(Vuex);
Vue.use(vuetify);

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    count: 0,  
    vehicles: [],
    geoJson: {},
    coordinates: [
      { x: -104.9293, y: 39.6984},
      { x: -104.9185, y: 39.6874}       
    ]
  },
  mutations: {
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
    updateLayer(state, data) {
      //Gather vehicle objects from geoJSON
      let listVehicles = [];
      data.features.forEach( feat => {
        listVehicles.push(parseVehicle(feat));
      });
      state.vehicles.splice(0, state.vehicles.length, ...listVehicles);
      //state.geoJson.map(data);
      Vue.set(state, 'geoJson', data);
      state.map.getSource('GTFS').setData(data);      
      console.log('Update');
    }
  },
  actions: {
    update ({ commit }) {
      setInterval(() => {
        axios.get('http://192.168.0.197:3000/data').then( response => {
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
    position: geoJSON.properties.position,
    vehicle: geoJSON.properties.vehicle,
    timestamp: new Date().toTimeString()
  };
  return vObject;
}

