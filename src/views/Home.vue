<template>
  <div class="home">
    <render/>
    <app-form/>
  </div>
</template>

<script>

import Render from '@/components/Render.vue';
import Form from '@/components/Form.vue';


export default {
  name: 'home',
  components: {
    Render,
    AppForm: Form
  },
  mounted() {
    this.srcs = [
      require('@/assets/img/cover-distorsion-dark.png'),
      require('@/assets/img/cover-distorsion.png'),
      require('@/assets/img/filters/water2.png'),
      require('@/assets/img/filters/ice.png'),
      require('@/assets/img/filters/soil.png'),
    ];

    this.srcs.forEach(src => {
      let image = new Image();
      image.src = src;
    })
  }
}
</script>

<style lang="scss">
.home {
  width: 100%;
  min-height: 700px;
  max-width: 1120px;
  margin: 100px auto 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 760px){
    flex-direction: column;
  }
  @media screen and (max-height: 840px){
    margin: 100px auto 100px auto;
  }
}
</style>
