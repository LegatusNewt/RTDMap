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
        <ul style="list-style: none">
          <li v-for="coord in coords">
            {{ `${coord.x.toFixed(4)} , ${coord.y.toFixed(4)}` }}
          </li>        
        </ul>
      </div>
      <div class="footer-sidebar" slot="footer">
      </div>
    </vs-sidebar>
</template>

<script>
let active = true;

export default {    
  data: function() {  
    //let coords = [{ x: 5, y: 6 }];
    let coords = this.$store.state.coordinates;
    return { active, coords };  
  },
  methods: { 
    clicked() {
      let state = this.$store.state;
      this.active = !this.active;    
      console.log(this.active);          
      state.coordinates.forEach( coord => {
        console.log(`${coord.x}, ${coord.y}`);
      })
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