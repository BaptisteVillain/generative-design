<template>
  <div class="home">
    <render-webgl/>
  </div>
</template>

<script>

import RenderWEBGL from '@/components/RenderWEBGL.vue';

export default {
  name: 'home',
  components: {
    RenderWebgl: RenderWEBGL
  }
}
</script>
