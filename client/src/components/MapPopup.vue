<template lang="html">
<div class='top-pop'>  
  <div class='data-pop'>
    <div><span>{{`RouteID: ${route}`}}</span></div>  
    <div><span>{{`VehicleID: ${vehicle}`}}</span></div>
  </div>
  <vs-button class="bottom-right" type="filled" color="success" icon="explore" v-on:click='findRoute(route)'/>
</div>
</template>

<script>
export default {  
  props: [ 'vehicle', 'route', 'tripId', 'shapeId'],
  data: function () {
      return {
      };
  },
  methods: {
    findRoute(route) {      
      if(this.$store.state.trips.features.findIndex( x => { x.id === route } ) == -1){      
        this.$store.dispatch('getShape', shapeId)
      } else{
        this.$store.commit('toggleShape', shapeId);
      }
    }
  }
};
</script>

<style>
    .vs-icon {
      font-size: x-large;
    }

   .bottom-right {
     position: absolute;
     top: 75%;
     left: 75%;     
   }

  .top-pop {
    display: flex;
  }

  .data-pop {
    display: flex;
    flex-direction: column;
  }
</style>
