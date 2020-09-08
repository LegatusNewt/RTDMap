<template>
  <v-app>
    <v-main>
      <Mapbox/>
      <SideBar/>
    </v-main>
  </v-app>
</template>

<script>
import Mapbox from './components/Mapbox.vue'
import SideBar from './components/SideBar.vue'  
import 'material-icons/iconfont/material-icons.css';
import Vuesax from 'vuesax'

export default {
  name: 'App',

  components: {
    Mapbox,
    SideBar    
  },

  data: () => ({
    //
  }),
};
</script>
