<template>
  <div id="render">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>

import {mapState} from 'vuex';

export default {
  name: 'Render',
  components: {
    // VueP5,
  },
  data() {
    return {
      size: {
        width: 595,
        height: 842,
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
      analyser: null,
      audio: null,
    }
  },
  computed: mapState([
    'data'
  ]),
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');

    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.setup();
      // this.setupBackground();
      this.animation = requestAnimationFrame(this.render);
    })

    this.image.src = require('@/assets/img/background.png');
  },
  methods: {
    async setup() {
      this.$refs.canvas.width = this.size.width;
      this.$refs.canvas.height = this.size.height;
      this.pixels = new Array(4 * this.size.width * this.size.height);
      this.stride = this.size.width * 4;
      this.soundSetup()
    },
    render() {
      this.animation = requestAnimationFrame(this.render);
      
      this.context.clearRect(0, 0, this.size.width, this.size.height);

      let data = this.getDataFromAudio()
      this.context.drawImage(this.image, 0, 0, this.size.width, this.size.height);
      // this.drawBackground(data);
      this.textVolume(Math.round(data.t[0]/40)-2)
      this.textStatic()
      
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

      this.drawBackground();
    },
    drawBackground(data) {
      const T = this.frames * this.interval * 2 / (1000-data.f[0]);
      let xs;
      let ys;
      // console.log(data)

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
    },
    soundSetup() {

      this.audio = new Audio();
      this.audio.src = require('@/assets/music/Jaden Smith - Watch Me.mp3')
      this.audio.load();

      let duration=0;
      window.AudioContext = window.AudioContext||window.webkitAudioContext; // old safari trick
      const audioContext = new AudioContext();
      this.analyser = audioContext.createAnalyser();
      this.analyser.connect(audioContext.destination);
      const source = audioContext.createMediaElementSource(this.audio);

      this.audio.addEventListener("canplaythrough", () => {
        console.log(this.audio)
        source.connect(this.analyser);
        duration = this.audio.duration;
        this.audio.play()
      });
    },
    getDataFromAudio(){
      //this.analyser.fftSize = 2048;
      var freqByteData = new Uint8Array(this.analyser.fftSize/2);
      var timeByteData = new Uint8Array(this.analyser.fftSize/2);
      this.analyser.getByteFrequencyData(freqByteData);
      this.analyser.getByteTimeDomainData(timeByteData);
      return {f:freqByteData, t:timeByteData}; // array of all 1024 levels
    },
    textVolume(volume) {
      for (let i = 1; i <= volume; i++) {
        this.context.font = "92px Aktiv Grotesk";
        this.context.fillStyle = "white";
        this.context.fillText("ERYS", 263, (70*i));
      }
    },
    textStatic() {
      this.context.font = "12px Aktiv Grotesk";
      this.context.fillStyle = "white";
      this.context.fillText("JADEN SMITH - ERYS", 50, 40);
      this.context.fillText("24.02.19", 50, 58);
      this.context.font = "10px Aktiv Grotesk";
      this.context.fillText("COPYRIGHT 2019 - JADEN SMITH X YOU", 355, 791);
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
