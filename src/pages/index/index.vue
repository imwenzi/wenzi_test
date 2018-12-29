<template>
  <div></div>
</template>

<script>
export default {
  mounted () {
    // let s = Symbol('foo')
    // console.log(s)
    function* gen () {
      yield 123 + 456
    }
    let f = gen()
    console.log(f.next())
  }
}
</script>

<style lang="less" scoped>

</style>
