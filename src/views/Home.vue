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
  height: calc(100vh - 80px);
  max-width: 1120px;
  margin: 100px auto 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  #form {
    margin-top: 0;
    margin-bottom: auto;
  }
}
</style>
