<template>
  <div id="render">
    <div ref="render"></div>
  </div>
</template>

<script>

import * as THREE from 'three'

export default {
  name: 'RenderWEBGL',
  data() {
    return {
      size: {
        width: 500,
        height: 700,
      },
    }
  },
  mounted() {
      this.scene =  new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera( 75, 1/1, 1, 1000 );
      this.camera.position.z = 650;
      this.renderer = new THREE.WebGLRenderer()

      this.renderer.setSize(this.size.width, this.size.height);
      this.$refs.render.appendChild(this.renderer.domElement);

      this.renderer.setClearColor( 0x0000FF, 1);

      var light = new THREE.AmbientLight( 0xf1f1f1 )
      this.scene.add(light);

      this.loader = new THREE.TextureLoader();
      this.loader.load(
        require('@/assets/img/background.png'),
        //onload
        texture => {
          texture.repeat.set(1, 1);
          const material = new THREE.MeshBasicMaterial({
            map: texture
          });

          const geometry = new THREE.PlaneGeometry( 1024, 1024);

          this.background = new THREE.Mesh(geometry, material);
          
          this.scene.add(this.background);

          this.render();
        },
        //onprogress
        undefined,
        //onerror
        error => {
          console.log(error);
        }
      )
  },
  methods: {
    render() {
      window.requestAnimationFrame(this.render);

      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>

<style lang="scss" scoped>
  #render {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
