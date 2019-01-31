<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

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

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Aktiv Grotesk', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  width: 100%;
  height: 100%;
}

</style>
