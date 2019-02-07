<template>
  <div id="app">
    <app-header/>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
export default {
  components: {
    AppHeader: Header
  }
  
}
</script>

<style lang="scss">
@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('~@/assets/fonts/AktivGrotesk-Light.woff2') format('woff2'),
    url('~@/assets/fonts/AktivGrotesk-Light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('~@/assets/fonts/AktivGrotesk-Medium.woff2') format('woff2'),
    url('~@/assets/fonts/AktivGrotesk-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Aktiv Grotesk';
  src: url('~@/assets/fonts/AktivGrotesk-Bold.woff2') format('woff2'),
    url('~@/assets/fonts/AktivGrotesk-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Druk Wide';
  src: url('~@/assets/fonts/DrukWide.woff2') format('woff2'),
    url('~@/assets/fonts/DrukWide.woff') format('woff');
  font-weight: 900;
  font-style: normal;
}

html, body {
  width: 100%;
  height: 100%;
  background-color: $black;
}

#app {
  font-family: 'Aktiv Grotesk', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  background-color: $black;
  color: #fff;
  text-align: left;
}

</style>
