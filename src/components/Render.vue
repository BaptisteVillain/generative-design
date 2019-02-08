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
      speed: 0,
      pixi: {},
      sound: {},
      frame: 0,
      covers: [],
      coverDeltaX: 0,
      coverDeltaY: 0,
      coverTimeLast: null,
      coverTimeGap: 200,
      coversIteration: 0,
      lastData: {},
      lyricsX: 0,
      lyricsY: 0,
      lyricsSize: 0,
      lyricsText: null
    }
  },
  computed: mapGetters({
    data: 'getData',
    update: 'getUpdate',
    download: 'onDownload'
  }),
  watch: {
    'update': function() {
      console.log(this.data);
      if(this.data.cover) {
        if(this.data.cover === 'A$AP Rocky') {
          this.setCover(-20, -35, 35, 20);
        } else if(this.data.cover === 'Aminé') {
          this.setCover(-10, 10, 20, 15);        
        } else if(this.data.cover === 'Kid Cudi') {
          this.setCover(-40, -5, 25, 25);        
        } else if(this.data.cover === 'Tyler The Creator') {
          this.setCover(50, 50, 25, 5);      
        } else if(this.data.cover === 'Pharell') {
          this.setCover(50, -50, 25, 10);      
        }
      }
      else if(this.data.lyrics) {
        this.coversIteration = 0
        this.covers = []

        const size = 1 + Math.random() * 4;
        const dx = (50 + Math.random() * 100) * Math.round(Math.random()) * 2 - 1;
        const dy = (50 + Math.random() * 200) * Math.round(Math.random()) * 2 - 1;
        this.setTextLyrics(this.data.lyrics, size, dx, dy);
      }
      else if(this.data.backgroundFilter) {
        if(this.pixi.textContainer) {
          this.pixi.textContainer.destroy(true)
        }
        if(this.lyricsContainer) {
          this.lyricsContainer.destroy(true)
        }

        if(this.data.backgroundFilter !== this.lastData.backgroundFilter) {
          if(this.data.backgroundFilter === 'Icon') {
            this.setBackgroundFilter(require('@/assets/img/filters/water2.png'))
            this.setSound(require('@/assets/music/Jaden Smith - Icon.mp3'))
          }
          else if(this.data.backgroundFilter === 'Batman') {
            this.setBackgroundFilter(require('@/assets/img/filters/ice.png'))
            this.setSound(require('@/assets/music/Jaden Smith - Batman.mp3'))
          }
          else if(this.data.backgroundFilter === 'Watch me') {
            this.setBackgroundFilter(require('@/assets/img/filters/alien.png'))
            this.setSound(require('@/assets/music/Jaden Smith - Watch Me.mp3'))
          }
          else if(this.data.backgroundFilter === 'Plastic') {
            this.setBackgroundFilter(require('@/assets/img/filters/soil.png'))
            this.setSound(require('@/assets/music/Jaden Smith - Plastic.mp3'))
          }
          this.lastData.backgroundFilter = this.data.backgroundFilter
        }
        else {
          // this.pauseSound()
        }
      }
      else if(this.data.backgroundColor) {
        this.lastData.backgroundFilter = null
        if(!this.sound.audio) {
          this.soundSetup()
        }
        else {
          this.sound.audio.pause()
        }
        
        if(this.data.backgroundColor === 'Dark side') {
          this.setBackground(require('@/assets/img/cover-distorsion-dark.png'));
        }
        else if(this.data.backgroundColor === 'Soft side') {
          this.setBackground(require('@/assets/img/cover-distorsion.png'));
        }
      }
    },
    'download': function() {
      this.saveCanvas();
    }
  },
  mounted() {
    this.pixiInit()
    this.pixiRender()
  },
  methods: {
    soundSetup() {
      this.sound.audio = new Audio();


      window.AudioContext = window.AudioContext||window.webkitAudioContext; // old safari trick

      const audioContext = new AudioContext();

      // this.setSound()

      this.sound.analyser = audioContext.createAnalyser();
      this.sound.analyser.connect(audioContext.destination);
      const source = audioContext.createMediaElementSource(this.sound.audio);

      this.sound.audio.addEventListener("canplaythrough", () => {
        console.log(this.sound.audio)
        source.connect(this.sound.analyser);
        this.sound.audio.play()
      });
    },
    setSound(music) {
      this.sound.audio.src = music
      this.sound.audio.load();
    },
    pauseSound() {
      if(!this.sound.audio.paused) {
        this.sound.audio.pause()
      }
      else {
        this.sound.audio.play()
      }
    },
    getDataFromAudio(){
      this.sound.analyser.fftSize = 2048;
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
        view: this.$refs.canvas,
        preserveDrawingBuffer: true
      });

      this.$refs.canvas.style.width = `${this.size.width/this.size.scale}px`;
      this.$refs.canvas.style.height = `${this.size.height/this.size.scale}px`;
        
      // Append PixiJS to body		
      this.$refs.render.appendChild(this.renderer.view);
      
      this.pixi.stage = new PIXI.Container();

      // this.setBackground();
    },
    pixiRender() {
      requestAnimationFrame(this.pixiRender);


      let frequency = 0
      let volume = 0
      if(this.data.backgroundFilter) {
        let dataSound = this.getDataFromAudio()
        if(!this.data.lyrics) {
          frequency = this.map(dataSound.f[0], 0, 200, 0, 10)
        }
        volume = Math.abs(Math.round(this.map(dataSound.t[0], 128, 200, 1, 9)))
      }
      
      if(this.pixi.filter && this.data.backgroundFilter) {
        this.moveBackground(frequency)
      }

      // if(this.frame == 0 && this.data.lyrics && !this.data.cover) {
      if(this.frame == 0 && this.data.lyrics) {
        this.textSound(volume)
      }

      if(this.data.quote === null || this.data.quote === undefined) {
        this.createCover();
        this.drawCovers();
      }

      this.textStatic();
      if(this.data.lyrics) this.textLyrics();
      this.textQuote(this.data.quote)

      this.renderer.render(this.pixi.stage);

      this.frame = (this.frame+1)%5
    },
    setBackground(backgroundImageSrc) {
      if(this.pixi.backgroundContainer) {
        this.pixi.backgroundContainer.destroy(true)
      }

      this.pixi.backgroundContainer = new PIXI.Container();
      // get our image background as a texture
      const texture = PIXI.Texture.fromImage(backgroundImageSrc);
      // add it to a sprite
      const backgroundImage = new PIXI.Sprite(texture);

      this.pixi.backgroundContainer.addChild(backgroundImage);

      this.resizeBackground(backgroundImage)

      this.pixi.stage.addChild(this.pixi.backgroundContainer)
    },
    setBackgroundFilter(filterImageSrc) {
      if(this.pixi.filter) {
        this.pixi.backgroundContainer.removeChild(this.pixi.filter)
      }
      // get our displacement map (image)	
      this.pixi.filter = PIXI.Sprite.fromImage(filterImageSrc);
      // set to repeat in a tiled patern
      this.pixi.filter.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;	
    
      // set filter to sprite container
      const displacementFilter = new PIXI.filters.DisplacementFilter(this.pixi.filter);
    
      // Add our filter and sprites to stage	
      this.pixi.backgroundContainer.filters = [displacementFilter];
      this.pixi.backgroundContainer.addChild(this.pixi.filter);
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
          text.y = (55*this.size.scale*i)-64*this.size.scale;
        } else {
          text.y = (55*this.size.scale)-64*this.size.scale;
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
    setTextLyrics(text, size, dX, dY) {
      this.lyricsX = dX,
      this.lyricsY = dY,
      this.lyricsSize = size,
      this.lyricsText = text
    },
    textLyrics() {
       if(this.lyricsContainer) {
        this.lyricsContainer.destroy(true)
      }
      this.lyricsContainer = new PIXI.Container();

      const style = new PIXI.TextStyle({
        fontFamily: 'Aktiv Grotesk',
        fontSize: 8*this.lyricsSize*this.size.scale,
        fill: '#f0dd00',
        wordWrap: true,
        wordWrapWidth: 215*(.5 + this.lyricsSize/2)*this.size.scale,
        align: 'center',
      })

      const text = new PIXI.Text(this.lyricsText, style);
      text.anchor.set(.5, 0);
      text.x = this.size.width/2 + this.lyricsX;
      text.y = this.size.height/2 + this.lyricsY;

      this.lyricsContainer.addChild(text);
      this.pixi.stage.addChild(this.lyricsContainer);
    },
    drawCovers() {
      if(this.pixi.coverContainer) {
        this.pixi.coverContainer.destroy();
      }
      this.pixi.coverContainer = new PIXI.Container();

      const coversrc = require('@/assets/img/cover.png');
      const coverTexture = new PIXI.Texture.fromImage(coversrc);
      

      this.covers.forEach(cover => {
        const sprite = new PIXI.Sprite(coverTexture);

        sprite.anchor.set(.5);

        if(this.data.backgroundColor === 'Soft side') {
          sprite.alpha = .7;
        }
        else {
          const colorMatrixDesaturate = new PIXI.filters.ColorMatrixFilter();
          const colorMatrixContrast = new PIXI.filters.ColorMatrixFilter();
          this.pixi.coverContainer.filters = [colorMatrixDesaturate, colorMatrixContrast];
          colorMatrixDesaturate.desaturate();
          colorMatrixContrast.contrast(0.5)
        }
        
        sprite.width = 300 * this.size.scale;
        sprite.height = 300 * this.size.scale;

        sprite.x = cover.x;
        sprite.y = cover.y;
        this.pixi.coverContainer.addChild(sprite);
      });

      this.pixi.stage.addChild(this.pixi.coverContainer);
    },
    setCover(dx, dy, time, iteration) {
      this.coverDeltaX = dx;
      this.coverDeltaY = dy;

      this.coverTimeLast = null;
      this.coverTimeGap = time;
      this.coversIteration = iteration;
      this.covers = [];
    },
    createCover() {
      const currentTime = Date.now();
      if(!this.coverTimeLast) this.coverTimeLast = currentTime;

      if(this.coversIteration > this.covers.length && currentTime - this.coverTimeLast > this.coverTimeGap) {
        this.addCover();
      }
    },
    addCover() {
      let cover = {
        x: (this.size.width/2) + (this.covers.length * this.coverDeltaX),
        y: (this.size.height/2) + (this.covers.length * this.coverDeltaY),
      };

      this.covers.unshift(cover);
      this.coverTimeLast = Date.now();
    },
    textQuote(quote) {
      if(this.quoteTextContainer) {
        this.quoteTextContainer.destroy(true)
      }
      this.quoteTextContainer = new PIXI.Container();

      const style = new PIXI.TextStyle({
        fontFamily: 'Aktiv Grotesk',
        fontSize: 10*2,
        fill: '#fff',
      });

      let text = new PIXI.Text(quote, style);
      text.x = 260*2;
      text.y = 659*2;
      this.quoteTextContainer.addChild(text)

      this.pixi.stage.addChild(this.quoteTextContainer)
    },
    saveCanvas() {
      const a = document.createElement('a');
      a.addEventListener('click', () => {
        var data = this.renderer.view.toDataURL("image/png", 1);
        a.href = this.renderer.view.toDataURL("image/png", 1);
        a.download = 'ERYS.png';
      })
      a.click();
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
