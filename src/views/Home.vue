<template>
  <div class="home">
    <Header/>
    <div class="container">
      <div class="wrapper">
        <render/>
        <Form/>
      </div>
      <!-- <render-webgl/> -->
    </div>

  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import Render from '@/components/Render.vue';
// import RenderWEBGL from '@/components/RenderWEBGL.vue';
import Form from '@/components/Form.vue';


export default {
  name: 'home',
  components: {
    Header,
    Render,
    // RenderWebgl: RenderWEBGL,
    Form
  }
}
</script>

<style lang="scss">
.home{
  background-color: $black;
  height: 100vh;
  color: #fff;
}

.wrapper{
  display: flex;
  flex-direction: row;
}
</style>
