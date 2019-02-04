<template>
  <header>
    <div class="container">
      <router-link to="/Home"><img src="../assets/img/logo-jaden.png" alt=""></router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    
  },
}

</script>

<style lang="scss">

header{
  padding: 33px 0;
}
.container{
  width: 85%;
  margin: 0 auto;
}
</style>

