<template>
  <div ref="render" id="render">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>

import * as PIXI from 'pixi.js'
import {mapGetters} from 'vuex';

export default {
  name: 'Render',
  components: {
    // VueP5,
  },
  data() {
    return {
      size: {
        width: 500 * window.devicePixelRatio,
        height: 700 * window.devicePixelRatio,
        scale: window.devicePixelRatio
      },
      speed: 1,
      pixi: {},
      sound: {},
      frame: 0,
      covers: [],
      coverDeltaX: -30,
      coverDeltaY: -30,
      coverTimeLast: null,
      coverTimeGap: 50,
      coversIteration: 10,
    }
  },
  computed: mapGetters({
    data: 'getData',
    update: 'getUpdate'
  }),
  watch: {
    'update': function() {
      console.log(this.data);
      if(this.data.background) {
        if(this.data.background === 'Dark') {
          this.setCover();
        }
        else if(this.data.background === 'Soft') {
          this.setCover();
        }
      }
    },
  },
  mounted() {
    this.soundSetup()
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
        this.sound.audio.play()
      });
    },
    setSound() {
      this.sound.audio.src = require('@/assets/music/Jaden Smith - Watch Me.mp3')
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
      this.renderer = PIXI.autoDetectRenderer(this.size.width, this.size.height, {
        antialias: true,
        transparent: true,
        view: this.$refs.canvas
      });

      this.$refs.canvas.style.width = `${this.size.width/this.size.scale}px`;
      this.$refs.canvas.style.height = `${this.size.height/this.size.scale}px`;
        
      // Append PixiJS to body		
      this.$refs.render.appendChild(this.renderer.view);
      
      this.pixi.stage = new PIXI.Container();

      this.setBackground();
    },
    pixiRender() {
      requestAnimationFrame(this.pixiRender);

      this.textStatic()

      let frequency = 0
      let volume = 0
      if(this.sound.audio) {
        let dataSound = this.getDataFromAudio()
        frequency = this.map(dataSound.f[0], 0, 200, 0, 10)
        volume = Math.abs(Math.round(this.map(dataSound.t[0], 128, 200, 1, 9)))
      }
      
      this.moveBackground(frequency)

      if(this.frame == 0) {
        this.textSound(volume)
      }

      this.createCover();
      

      this.renderer.render(this.pixi.stage);

      this.frame = (this.frame+1)%5
    },
    setBackground() {
      let backgroundImageSrc = require('@/assets/img/background.png');
      let filterImageSrc = require('@/assets/img/filters/water.png');

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
    moveBackground(volume) {
      if(this.pixi.filter) {
        this.pixi.filter.x += this.speed + volume;
        this.pixi.filter.y += this.speed + volume;
      }
    },
    textSound(volume) {
      if(this.pixi.textContainer) {
        this.pixi.textContainer.destroy(true)
      }
      this.pixi.textContainer = new PIXI.Container();

      for (let i = 0; i <= volume; i++) {
        const style = new PIXI.TextStyle({
          fontFamily: 'Druk Wide',
          fontSize: 64*this.size.scale,
          fontWeight: '900',
          fill: '#fff',
        });

        let text = new PIXI.Text('ERYS', style);
        text.x = 263*2;
        if (i) {
          text.y = (70*2*i)-64*this.size.scale;
        } else {
          text.y = (70*2)-64*this.size.scale;
        }

        this.pixi.textContainer.addChild(text)
      }

      this.pixi.stage.addChild(this.pixi.textContainer)
    },
    textStatic() {
      if(this.staticTextContainer) {
        this.staticTextContainer.destroy(true)
      }
      this.staticTextContainer = new PIXI.Container();

      const style = new PIXI.TextStyle({
        fontFamily: 'Aktiv Grotesk',
        fontSize: 12*2,
        fill: '#fff',
      });

      let text = new PIXI.Text('JADEN SMITH - ERYS', style);
      text.x = 50*2;
      text.y = 40*2;
      this.staticTextContainer.addChild(text)

      text = new PIXI.Text('24.02.19', style);
      text.x = 50*2;
      text.y = 58*2;
      this.staticTextContainer.addChild(text)

      const styleBis = new PIXI.TextStyle({
        fontFamily: 'Aktiv Grotesk',
        fontSize: 10*2,
        fill: '#fff',
      });

      text = new PIXI.Text('COPYRIGHT 2019 - JADEN SMITH X YOU', styleBis);
      text.x = 260*2;
      text.y = 649*2;
      this.staticTextContainer.addChild(text)

      this.pixi.stage.addChild(this.staticTextContainer)
    },
    setCover() {
      this.coverContainer = new PIXI.Container();
      this.pixi.stage.addChild(this.coverContainer);
    },
    addCover() {
      const coversrc = require('@/assets/img/cover.png');
      const coverTexture = new PIXI.Texture.fromImage(coversrc);

      let cover = new PIXI.Sprite(coverTexture);
      // cover.blendMode = PIXI.BLEND_MODES.LIGTHEN;

      cover.width = 300 * this.size.scale;
      cover.height = 300 * this.size.scale;

      cover.anchor.set(.5);
      cover.x = (this.size.width/2) + (this.covers.length * this.coverDeltaX);
      cover.y = (this.size.height/2) + (this.covers.length * this.coverDeltaY);

      this.coverContainer.addChild(cover);
      this.coverTimeLast = Date.now();

      this.covers.push(cover);
    },
    createCover() {
      if(!this.coverTimeLast) this.coverTimeLast = Date.now();
      const currentTime = Date.now();

      if(this.coverContainer && this.coversIteration > this.covers.length && currentTime - this.coverTimeLast > this.coverTimeGap) {
        this.addCover();
      }
    },



    map(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
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
