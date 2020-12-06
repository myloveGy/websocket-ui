<template>
  <a-form-item>
    <a-select v-decorator="[name]" :placeholder="placeholder" :style="{width: width}">
      <a-select-option v-for="item in data" :key="item.value" :value="item.value">
        {{ item.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
export default {
  name: 'CSelect',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    name: String,
    placeholder: String,
    data: Array,
  },
}
</script>

<style scoped>

</style>
