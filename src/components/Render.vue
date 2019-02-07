<template>
  <div ref="render" id="render">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>

import * as PIXI from 'pixi.js'
import {mapState} from 'vuex';

export default {
  name: 'Render',
  components: {
    // VueP5,
  },
  data() {
    return {
      size: {
        // width: 595,
        // height: 842,
        width: 500,
        height: 700
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
    // this.context = this.$refs.canvas.getContext('2d');

    // this.image = new Image();
    // this.image.addEventListener('load', () => {
    //   this.setup();
    //   this.setupBackground();
    //   this.animation = requestAnimationFrame(this.render);
    // })

    this.setup();
    this.pixiInit()

    // this.image.src = require('@/assets/img/background-2.jpg');
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
    },
    pixiInit() {
      var size = [this.size.width, this.size.height];
      var ratio = size[0] / size[1];
      this.stage = new PIXI.Stage(0x333333, true);
      this.renderer = PIXI.autoDetectRenderer(size[0], size[1], {antialias: true ,transparent: true, view: this.$refs.canvas});
      let background = require('@/assets/img/background.jpg');
      let water = require('@/assets/img/filters/water.png')


      // our animation speed	
      this.speed = 0.05;
        
      // Append PixiJS to body		
      this.$refs.render.appendChild(this.renderer.view);
      
      this.stage = new PIXI.Container();
    
      // get our image background as a texture
      var texture = PIXI.Texture.fromImage(background);
      // add it to a sprite
      var image = new PIXI.Sprite(texture);

      // get our displacement map (image)	
      this.displacementSprite = PIXI.Sprite.fromImage(water);
      // set to repeat in a tiled patern
      this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;	
    

    
      // set filter to sprite container
      var displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
    
      // Add our filter and sprites to stage	
      this.stage.filters = [displacementFilter];
      this.stage.addChild(this.displacementSprite);
      this.stage.addChild(image);

      // Resize image
      var containerWidth = size[0];
      var containerHeight = size[1];
      var imageRatio = image.width / image.height;
      var containerRatio = containerWidth / containerHeight;

      if(containerRatio > imageRatio) {
        image.height = image.height / (image.width / containerWidth);
        image.width = containerWidth;
        image.position.x = 0;
        image.position.y = (containerHeight - image.height) / 2;
      }else{
        image.width = image.width / (image.height / containerHeight);
        image.height = containerHeight;
        image.position.y = 0;
        image.position.x = (containerWidth - image.width) / 2;
      }

      this.pixiRender()
    },
    pixiRender() {
      requestAnimationFrame(this.pixiRender);

      let data = this.getDataFromAudio()

      this.displacementSprite.x += this.speed*data.f[0];
      this.displacementSprite.y += this.speed*data.f[0];

      this.renderer.render(this.stage);
    }
  }
}
</script>

<style lang="scss" scoped>
  // #render {
  //   width: 100%;
  //   height: 100%;
  //   display: flex;
  //   align-items: center;
  // }
</style>
