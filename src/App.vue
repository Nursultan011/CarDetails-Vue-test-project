<template>
  <div id="app">
    <CarDetail />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CarDetail from './components/CarDetail.vue';

export default Vue.extend({
  name: 'App',
  components: {
    CarDetail
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
