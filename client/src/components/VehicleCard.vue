<template lang="html">
    <vs-card class="vh-card">
        <img class="vh-icon" v-bind:src="`${vh.icon}2x.png`">                                      
        <div class="vh-div" style="display:grid">                  
            <span class="vh-span">
                {{ `${vh.vehicle.label}` }}
            </span>                    
        </div>
        <vs-button type="border" class="vh-button" color="primary" v-on:click='findTarget(vh)' icon="gps_fixed"></vs-button>
    </vs-card>
</template>

<script>
export default {    
  props: [ 'vh' ],
  methods: { 
    clicked() {
      let state = this.$store.state;
      this.active = !this.active;    
      console.log(this.active);          
      state.coordinates.forEach( coord => {
        console.log(`${coord.x}, ${coord.y}`);
      })
      console.log(this.vehicles.length);
    },
    findTarget(vh) {      
      console.log(`${vh.position.latitude} : ${vh.position.longitude}`);
      this.$store.commit('targetAquired', vh);
    },
    routeDetails(rt) {
      this.$store.dispatch('rModule/getTrips', rt);
      this.$store.commit('rModule/openInfo', rt);
    }
  }
};
</script>

<style>
.vh-card .vs-card--content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vh-icon {
  flex: 1;
  max-width: fit-content;
}

.vh-div {
  flex: 2;
  max-width: fit-content;  
}

.vh-span {
  text-align: center;
  font-size: x-large;
  font-weight: bold;
  font-family: 'Roboto';
}

.vh-button {
  flex: 1;
  max-width: fit-content;
}
</style>

