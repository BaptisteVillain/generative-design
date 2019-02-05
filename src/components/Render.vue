<template>
  <div id="render">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>

// import VueP5 from 'vue-p5';

export default {
  name: 'Render',
  components: {
    // VueP5,
  },
  data() {
    return {
      size: {
        width: 500,
        height: 700,
      },
      context: null,
      amplitude: 100,
      fps: 60,
      interval: 1000 / 60,
      frames: 0,
      timestamp: Date.now(),
      pixels: [],
      stride: null,
      result: [],
    }
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');

    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.setup();
      this.setupBackground();
      this.animation = requestAnimationFrame(this.render);
    })

    this.image.src = require('@/assets/img/background-2.jpg');
  },
  methods: {
    async setup() {
      this.$refs.canvas.width = this.size.width;
      this.$refs.canvas.height = this.size.height;
      this.pixels = new Array(4 * this.size.width * this.size.height);
      this.stride = this.size.width * 4;
    },
    render() {
      this.animation = requestAnimationFrame(this.render);
      
      this.context.clearRect(0, 0, this.size.width, this.size.height);
  
      this.drawBackground();
      
      this.frames++;
    },
    setupBackground() {
      this.context.drawImage(this.image, 0, 0);

      const source = this.context.getImageData(0, 0, this.size.width, this.size.height);
      this.result = this.context.createImageData(this.size.width, this.size.height);

      for (let i = 0; i < 4 * this.size.height * this.size.width; i += 1) {
        this.pixels[i] = source.data[i];
        this.result.data[i] = 255;
      }
    },
    drawBackground() {
      const T = this.frames * this.interval * .6 / 1000;
      let xs;
      let ys;

      for (let x = this.amplitude; x < this.size.width - this.amplitude; ++x) {
        ys = this.amplitude * Math.cos(2 * Math.PI * (3 * x / this.size.width + T));
        ys = Math.round(ys);
        for (let y = this.amplitude; y < this.size.height - this.amplitude; ++y) {
          xs = this.amplitude * Math.sin(2 * Math.PI * (3 * y / this.size.height + T));
          xs = Math.round(xs);


          let dest = y * this.stride + x * 4;
          let src = (y + ys) * this.stride + (x + xs) * 4;

          this.result.data[dest] = this.pixels[src];
          this.result.data[dest + 1] = this.pixels[src + 1];
          this.result.data[dest + 2] = this.pixels[src + 2];
        }
      }

      this.context.putImageData(this.result, 0, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
  #render {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
