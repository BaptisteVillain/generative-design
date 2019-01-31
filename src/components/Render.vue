<template>
  <div id="render">
    <vue-p5
      @setup="setup"
      @draw="draw"
      />
  </div>
</template>

<script>

import VueP5 from 'vue-p5';

export default {
  name: 'Render',
  components: {
    VueP5,
  },
  data() {
    return {
      yPos: window.innerHeight,
    }
  },
  methods: {
    setup(sketch) {
      sketch.createCanvas(window.innerWidth, window.innerHeight);
      sketch.frameRate(60);
    },
    draw(sketch) {
      sketch.background(204);

      this.yPos = this.yPos - 1;
      if (this.yPos < 0) {
        this.yPos = sketch.height;
      }

      sketch.line(0, this.yPos, sketch.width, this.yPos);
    }
  }
}
</script>

<style lang="scss">
  #render {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
