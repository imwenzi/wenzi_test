<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
body{
  width: 100%;
  min-width: 5760px;
  height: 1080px;
  overflow-y: hidden;
  overflow-x: auto;
}
#app {
}
</style>
