<template>
  <div class="home">
    <Header/>
    <div class="container">
      <render/>
      <render-webgl/>
    </div>

  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import Render from '@/components/Render.vue';
import RenderWEBGL from '@/components/RenderWEBGL.vue';


export default {
  name: 'home',
  components: {
    Header,
    Render,
    RenderWebgl: RenderWEBGL
  }
}
</script>

<style lang="scss">
.home{
  background-color: $black;
  height: 100vh;
}
</style>
