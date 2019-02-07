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

<style lang="scss" scoped>

header{
  height: 80px;
}
.container{
  width: 100%;
  height: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
}
</style>

