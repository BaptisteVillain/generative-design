<template>
  <div class="home">
    <Header/>
    <div class="container">
      <render/>
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import Render from '@/components/Render.vue';

export default {
  name: 'home',
  components: {
    Header,
    Render,
  }
}
</script>

<style lang="scss">
.home{
  background-color: $black;
  height: 100vh;
}
</style>
