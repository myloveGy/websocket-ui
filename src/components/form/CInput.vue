<template>
  <a-form-item>
    <a-input v-decorator="[name]" :placeholder="placeholder"/>
  </a-form-item>
</template>

<script>
export default {
  name: 'CInput',
  props: {
    name: String,
    placeholder: String,
  },
}
</script>

<style scoped>

</style>
