import axios from 'axios'
import Vue from 'vue'

const connString = 'http://justinian:3000';

export default {
    namespaced: true,
    state: () => ({
        infoVisible: false,
        sheet: false,
        infoData: {},
        routes: [],
        trips: {}
    }),
    mutations: {
        updateRoutes(state, data) {
            //Sort Routes by Color            
            data.sort( (a,b) => (a.route_color < b.route_color) ? 1 : -1 );
            state.routes.splice(0, state.routes.length, ...data);
        },
        updateTripState(state, data) {
            let currentTrips = state.trips;
            currentTrips[data.routeId] = data.response;
            Vue.set(state, 'trips', currentTrips); 
        },
        openInfo(state, route) {
            Vue.set(state, 'infoData', { route: route, trips: state.trips[route.route_id]});
            Vue.set(state, 'sheet', true);
            //Vue.set(state, 'infoVisible', true);      
        },
        hideInfo(state, override) {
            Vue.set(state, 'sheet', override);
        }
    },
    actions: {        
        updateRoutes ({ commit }) {
            axios.get(`${connString}/routes`).then( response => {
              commit('updateRoutes', response.data)        
            });
            setInterval(() => {
              axios.get(`${connString}/routes`).then( response => {
                commit('updateRoutes', response.data)        
              });
            }, 60000*5);
        },
        getTrips({ commit }, route) {
            axios.get(`${connString}/routes/trips`, { params: { routeId: route.route_id }} ).then( response => {
              let data = { routeId: route.route_id, response: response.data };
              commit('updateTripState', data);
            })
        }
    }
}