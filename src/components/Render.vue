<template>
  <div id="render">
    <canvas ref="canvas" :width="size.width" :height="size.height"></canvas>
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
        width: 350,
        height: 500,
      },
      context: null,
      amplitude: 52,
      fps: 60,
      interval: 1000 / 60,
      frames: 0,
      timestamp: Date.now(),
      pixels: [],
      stride: null
    }
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');

    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.setup();
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
      this.frames++;
      this.context.clearRect(0, 0, this.size.width, this.size.height);

      console.log('hello world');
      this.drawBackground();
    },
    drawBackground() {

      this.context.drawImage(this.image, 0, 0);

      const source = this.context.getImageData(0, 0, this.size.width, this.size.height);
      const result = this.context.createImageData(this.size.width, this.size.height);

      for (let i = 0; i < 4 * this.size.height * this.size.width; i += 1) {
        this.pixels[i] = source.data[i];
        result.data[i] = 255;
      }

      const T = this.frames * this.interval * 0.6 / 1000;
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

          result.data[dest] = this.pixels[src];
          result.data[dest + 1] = this.pixels[src + 1];
          result.data[dest + 2] = this.pixels[src + 2];
        }
      }

      this.context.putImageData(result, 0, 0);

      // for (let x = amplitude; x < this.size.width - amplitude; ++x) {
      //   for (let y = amplitude; y < this.size.height - amplitude; ++y) {
      //     let xs = amplitude * Math.sin(2 * Math.PI * (3 * y / height + T));
      //     let ys = amplitude * Math.cos(2 * Math.PI * (3 * x / width + T));
      //     xs = Math.round(xs);
      //     ys = Math.round(ys);
      //     dest = y * stride + x * 4;
      //     src = (y + ys) * stride + (x + xs) * 4; 
      //     r[dest] = pixels[src];
      //     r[dest + 1] = pixels[src + 1];
      //     r[dest + 2] = pixels[src + 2];
      //   }
      // }
    }
    // setup(sketch) {
    //   sketch.createCanvas(this.size.width, this.size.height);
    //   sketch.frameRate(this.fps);

    //   this.density = sketch.pixelDensity();
    // },
    // preload(sketch) {
    //   const imgsrc = require('@/assets/img/background.jpg');
    //   this.image = sketch.loadImage(imgsrc);

    //   // const fragsrc = require('@/assets/shaders/main.frag');
    //   // const vertsrc = require('@/assets/shaders/main.vert');

    //   // this.shaders = fragsrc;
    // },
    // draw(sketch) {
    //   this.yPos = this.yPos - 1;
    //   if (this.yPos < 0) {
    //     this.yPos = sketch.height;
    //   }

    //   sketch.image(this.image, -100, 0, this.image.width, this.image.height);
    //   let d = this.density;
    //   let halfImage = 4 * (sketch.width * d) * (sketch.height * d);

    //   const stride = sketch.width * 4;
    //   const T = this.frames * this.interval * .6 / 1000;

    //   sketch.loadPixels();
    //   for (let x = this.amplitude; x < (sketch.width - this.amplitude); ++x) {
    //     for(let y = this.amplitude; y < (sketch.height - this.amplitude); ++y) {
    //       let xs = this.amplitude * Math.sin(2 * Math.PI * (3 * y / sketch.height + this.frames));
    //       let ys = this.amplitude * Math.cos(2 * Math.PI * (3 * x / sketch.width + this.frames));

    //       xs = Math.round(xs);
    //       ys = Math.round(ys);

    //       let dest = y * stride + x;
    //       let src = (y + ys) * stride + (x + xs) * 4;

    //       sketch.pixels[dest] = sketch.pixels[src];
    //       sketch.pixels[dest + 1] = sketch.pixels[src + 1];
    //       sketch.pixels[dest + 2] = sketch.pixels[src + 2];
    //     }
    //   }
    //   sketch.updatePixels();

    //   sketch.line(0, this.yPos, sketch.width, this.yPos);
    //   sketch.stroke(255);


    //   // console.log(sketch.frames);
    //   // console.log(frequency);
    //   this.frames++;
    // },
  }
}
</script>

<style lang="scss">
  #render {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
