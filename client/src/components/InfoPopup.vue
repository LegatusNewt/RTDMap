<template lang="html">
<vs-popup class='holamundo' title="Route Info" :active.sync="active">
    <div>
      <h2>{{`${route.route_long_name}`}}</h2>
      <p>{{`${route.route_desc}`}}</p>
      <p>{{`Data: ${JSON.stringify(route)}`}}</p>
    </div>      
</vs-popup>
</template>

<script>

import { state } from 'vuex';

export default {  
  props: [ 'route' ],
  computed: {    
    active: {
        get: function () {
            return this.$store.state.infoVisible;
        },
        set: function () {
            this.$store.commit('hideInfo');
        }
    },
    route () {
        return this.$store.state.infoData;
    }
  },
  data: function() {      
    return {       
    };  
  },
  methods: {

  }
}
</script>

<style>
   
</style>
