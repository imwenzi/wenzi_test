<style lang="less" scoped>
  .run-num{
    display: inline;
  }
</style>
<template>
  <div class="run-num">
    <ICountUp
      :startVal="startVal"
      :endVal="num"
      :decimals="decimals ? decimals : 0"
      :duration="2.5"
      :options="options"
      @ready="onReady">
    </ICountUp>
    <slot></slot>
  </div>
</template>
<script>
import ICountUp from 'vue-countup-v2'
export default {
  name: 'run-num',
  props: ['num', 'decimals', 'time'],
  components: {
    ICountUp
  },
  watch: {
    num (value) {
      this.updateTime++
    }
  },
  data () {
    return {
      options: {
        useEasing: false,
        useGrouping: false,
        separator: '',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      startVal: 0,
      instance: false,
      updateTime: 0
    }
  },
  mounted () {
  },
  methods: {
    onReady (instance) {
      if (this.updateTime !== 0 && this.time) {
        instance.duration = this.time
      }
    }
  }
}
</script>
