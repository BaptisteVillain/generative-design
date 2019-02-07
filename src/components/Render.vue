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
      speed: 1,
      pixi: {},
      sound: {}
    }
  },
  computed: mapState([
    'data'
  ]),
  mounted() {
    this.pixiInit()
    this.pixiRender()
  },
  methods: {
    soundSetup() {
      this.sound.audio = new Audio();

      window.AudioContext = window.AudioContext||window.webkitAudioContext; // old safari trick

      const audioContext = new AudioContext();

      this.setSound()

      this.sound.analyser = audioContext.createAnalyser();
      this.sound.analyser.connect(audioContext.destination);
      const source = audioContext.createMediaElementSource(this.sound.audio);

      this.sound.audio.addEventListener("canplaythrough", () => {
        console.log(this.sound.audio)
        source.connect(this.sound.analyser);
        // this.sound.audio.play()
      });
    },
    setSound(audioSrc = '@/assets/music/Jaden Smith - Watch Me.mp3') {
      this.sound.audio.src = require(audioSrc)
      this.sound.audio.load();
    },
    getDataFromAudio(){
      //this.sound.analyser.fftSize = 2048;
      const freqByteData = new Uint8Array(this.sound.analyser.fftSize/2);
      const timeByteData = new Uint8Array(this.sound.analyser.fftSize/2);
      this.sound.analyser.getByteFrequencyData(freqByteData);
      this.sound.analyser.getByteTimeDomainData(timeByteData);
      return {f:freqByteData, t:timeByteData}; // array of all 1024 levels
    },
    pixiInit() {
      const ratio = this.size.width / this.size.height;
      this.renderer = PIXI.autoDetectRenderer(this.size.width, this.size.height, {antialias: true ,transparent: true, view: this.$refs.canvas});
      
      let background = require('@/assets/img/background.jpg');
      let water = require('@/assets/img/filters/water.png')
        
      // Append PixiJS to body		
      this.$refs.render.appendChild(this.renderer.view);
      
      this.pixi.stage = new PIXI.Container();

      this.setBackground(background, water)
    },
    pixiRender() {
      requestAnimationFrame(this.pixiRender);

      // let data = this.getDataFromAudio()

      this.moveBackground()

      this.renderer.render(this.pixi.stage);
    },
    setBackground(backgroundImageSrc, filterImageSrc) {
      const backgroundContainer = new PIXI.Container();
      // get our image background as a texture
      const texture = PIXI.Texture.fromImage(backgroundImageSrc);
      // add it to a sprite
      const backgroundImage = new PIXI.Sprite(texture);

      // get our displacement map (image)	
      this.pixi.filter = PIXI.Sprite.fromImage(filterImageSrc);
      // set to repeat in a tiled patern
      this.pixi.filter.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;	
    
      // set filter to sprite container
      const displacementFilter = new PIXI.filters.DisplacementFilter(this.pixi.filter);
    
      // Add our filter and sprites to stage	
      backgroundContainer.filters = [displacementFilter];
      backgroundContainer.addChild(this.pixi.filter);
      backgroundContainer.addChild(backgroundImage);

      this.resizeBackground(backgroundImage)

      this.pixi.stage.addChild(backgroundContainer)
    },
    resizeBackground(backgroundImage) {
      // Resize image
      const containerWidth = this.size.width;
      const containerHeight = this.size.height;
      const imageRatio = backgroundImage.width / backgroundImage.height;
      const containerRatio = containerWidth / containerHeight;

      if(containerRatio > imageRatio) {
        backgroundImage.height = backgroundImage.height / (backgroundImage.width / containerWidth);
        backgroundImage.width = containerWidth;
        backgroundImage.position.x = 0;
        backgroundImage.position.y = (containerHeight - backgroundImage.height) / 2;
      }else{
        backgroundImage.width = backgroundImage.width / (backgroundImage.height / containerHeight);
        backgroundImage.height = containerHeight;
        backgroundImage.position.y = 0;
        backgroundImage.position.x = (containerWidth - backgroundImage.width) / 2;
      }
    },
    moveBackground() {
      if(this.pixi.filter) {
      this.pixi.filter.x += this.speed;
      this.pixi.filter.y += this.speed;
      }
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
