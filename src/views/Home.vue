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
  }
}
</script>

<style lang="scss">
.home {
  width: 100%;
  min-height: 700px;
  max-width: 1120px;
  margin: 100px auto 100px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 760px){
    flex-direction: column;
  }
}
</style>
