<template>
  <div id="app">              
    <Mapbox/>
    <SideBar/>            
  </div>
</template>

<script>
import Mapbox from './components/Mapbox.vue'
import SideBar from './components/SideBar.vue'  
import Vuesax from 'vuesax'

export default {
  name: 'app',
  components: {
    Mapbox,
    SideBar
  }  
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
