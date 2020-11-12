<template lang="html">
<div v-if="!this.sheet" class='bottom-mid'>      
    <vs-button type="border" v-on:click='clicked()' icon="keyboard_arrow_up"></vs-button>
</div>
<v-bottom-sheet noClickAnimation=true v-else-if="this.sheet" v-model="sheet" hide-overlay persistent>
    <vs-button type="border" class="toggle-bbar" icon="close" v-on:click='clicked()'></vs-button>
    <div>
      <h2>{{`${route ? route.route_long_name : 'No Route'}`}}</h2>
      <p>{{`${route ? route.route_desc : 'No Route'}`}}</p>      
      <ul class="v-bottom-list">
          <li v-for="v in vehicles" :key="v.id">          
              <VehicleCard v-bind:vh="v"></VehicleCard>
          </li>
      </ul>
    </div>
    <div>

    </div>
</v-bottom-sheet>
</template>

<script>
import { state } from 'vuex';
import VehicleCard from './VehicleCard'

export default {    
  name: 'BottomBar',
  components: {
    VehicleCard
  },
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
      sheet: true
    };  
  },
  methods: { 
    clicked() {
        this.sheet = !this.sheet;
        console.log('Clicked!');      
    }
  }
};
</script>

<style>

.custom-bbar {
  border-radius: 10px;
}

.v-bottom-sheet{
  min-height: 20%;
  background-color: #FFFFFF;
  opacity: 100%;
  left: 260px;
  max-width: 66%;
}

.v-bottom-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}

.toggle-bbar {
  position: sticky;
  margin: .5rem;
  left: 100%;
  height: 25px;
  width: 25px;
}

.bottom-mid {
    position:fixed;
    left : 50%;
    bottom : 0;
    size: 10px;
    z-index: 10;
}
</style>