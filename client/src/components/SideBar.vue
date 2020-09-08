<template lang="html">
    <div v-if="!this.active" class='up-left'>      
        <button v-on:click='clicked()' class='img-btn'><img src="denver.png"></button>
    </div>
    <vs-sidebar parent="body" v-else-if="this.active" default-index="1" color="primary" class="sidebarx" spacer v-model="this.active">      
      <div class="header-sidebar" slot="header">
        <vs-button class="toggle-sidebar" v-on:click='clicked()'/>
        <vs-avatar class="flag-avatar" src="./denver.png"/>
        <h4>
          RTD Transit
        </h4>
      </div>
      <div class="body-sidebar">    
        <h4>Transit</h4>
        <vs-sidebar-group title="Vehicles">
          <ul style="list-style: none">
            <li v-for="vh in vehicles">
               <vs-card>
               <div style="display:flex">
                  <img v-if="vh.icon == 'tram-black'" src="/tram2x.png">                                      
                  <img v-if="vh.icon == 'bus-black'" src="/bus2x.png">
                  <div style="display:grid">                  
                    <span>
                      {{ `ID: ${vh.vehicle.label}` }}
                    </span>
                    <span>
                      {{ `Pos: ${vh.position.longitude.toFixed(4)}, ${vh.position.latitude.toFixed(4)}` }}
                    </span>
                  </div>
                  <vs-button color="primary" v-on:click='findTarget(vh)' icon="gps_fixed"></vs-button>
                </div>
              </vs-card>
            </li>
          </ul> 
        </vs-sidebar-group>     
      </div>
      <div class="footer-sidebar" slot="footer">
      </div>
    </vs-sidebar>
</template>

<script>
export default {    
  data: function() {      
    return { 
      active: true,
      vehicles: this.$store.state.vehicles,
      coords: this.$store.state.coordinates
    };  
  },
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
    }
  }
};
</script>

<style>
.up-left {
  position:fixed;
  left : 0px;
  top : 0px;
  size: 50px;
  z-index: 10;
}

.up-left img {
  height: 50px;
  width: 50px;  
}

.toggle-sidebar {
  position: sticky;
  margin: .5rem;
  left: 100%;
  height: 25px;
  width: 25px;
}

.vs-sidebar--background {
  width: 0px;
}

.flag-avatar {
  height: 70px;
  width: 70px;
}

.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.body-sidebar {  
  margin-left:10%;
  margin-right:10%;
}

h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.footer-sidebar,
button {
  border: 0px solid rgba(0, 0, 0, 0);
  border-left: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 0px;
}
</style>