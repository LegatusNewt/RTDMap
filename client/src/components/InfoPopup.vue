<template lang="html">
<vs-popup id="info" style='position: absolute' class='holamundo' title="Route Info" :active.sync="active">
    <div>
      <h2>{{`${route.route_long_name}`}}</h2>
      <p>{{`${route.route_desc}`}}</p>
      <p>{{`Data: ${JSON.stringify(route)}`}}</p>
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
          return this.$store.state.infoVisible;
        },
        set: function () {
          return this.$store.commit('hideInfo');
        }
    },
    route () {
        return this.$store.state.infoData.route;
    },
    trips: {
      get: function() {        
        return this.$store.state.trips[this.route.route_id] || [];
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
