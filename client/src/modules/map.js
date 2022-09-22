import axios from 'axios'
import Vue from 'vue'

const connString = 'http://justinian:3000'; //change to config file value

export default {
    namespaced: true,
    state: () => ({
        map: {}
    }),
    mutations: {
        updateLayer(state, data){            
            state.map.getSource(data.layer).setData(data.source);      
        },
        addLayer(state, layer){
            state.map.addLayer(layer);
        },
        filterLayer(state, data) {
            //Ex: data.expression
            //  ['==', 'type', 'LRT']
            //  ['==', 'type', 'Bus']            
            state.map.setFilter(data.layer, data.expression);
        },
        testFilter(state) {
            state.map.setFilter('Trips', ['==','TYPE','LRT']);
        }
    },
    actions: {    

    }
}