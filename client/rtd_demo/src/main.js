import Vue from 'vue'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Vuesax from 'vuesax'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuesax);
Vue.use(Vuex);

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    count: 0,
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

    }
  }
});

new Vue({
  store,  
  render: h => h(App)
}).$mount('#app')


