<template lang="html">
<vs-popup id="info" style='position: absolute' class='holamundo' title="Route Info" :active.sync="active">
    <div>
      <h2>{{`${route ? route.route_long_name : 'No Route'}`}}</h2>
      <p>{{`${route ? route.route_desc : 'No Route'}`}}</p>
      <p>{{`Data: ${JSON.stringify(route)}`}}</p>
      <ul>
          <li v-for="v in vehicles" :key="v.id">
            <span>{{v.vehicle.label}}</span>
          </li>
      </ul>
    </div>
    <div>

    </div>
</vs-popup>
</template>

<script>

import { state } from 'vuex';

export default {  
  computed: {    
    active: {
        get: function () {
          return this.$store.state.rModule.infoVisible;
        },
        set: function () {
          return this.$store.commit('rModule/hideInfo');
        }
    },
    route () {
      return this.$store.state.rModule.infoData.route || 'No Route';
    },
    vehicles () {
      let rId = this.route ? this.route.route_id : null;
      let vhs = this.$store.state.vehicles.filter( x => {
        return x.trip && x.trip.routeId === rId;
      });
      return vhs;
    },
    trips: {
      get: function() {        
        return this.$store.state.rModule.trips[this.route.route_id] || [];
      }
    }
  },
  data: function() {      
    return {       
    };  
  }
}

</script>

<style>
   
</style>
