<template>
  <v-app>
    <v-main>
      <BottomBar/>
      <Mapbox/>
      <SideBar/>
      <InfoPopup/>
    </v-main>
  </v-app>
</template>

<script>
import Mapbox from './components/Mapbox.vue';
import SideBar from './components/SideBar.vue';
import InfoPopup from './components/InfoPopup.vue' ; 
import BottomBar from './components/BottomBar.vue';
import 'material-icons/iconfont/material-icons.css';
import Vuesax from 'vuesax'

export default {
  name: 'App',

  components: {
    Mapbox,
    SideBar,
    InfoPopup,
    BottomBar
  },

  data: () => ({
    //
  }),
};
</script>
