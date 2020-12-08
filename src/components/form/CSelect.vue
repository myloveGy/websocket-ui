<template>
  <a-form-item :label="label">
    <a-select v-decorator="[name, {rules: rulesArray, initialValue}]" :placeholder="placeholder" :style="{width: width}">
      <a-select-option v-for="item in data" :key="item.value" :value="item.value">
        {{ item.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import {rulesToArray} from '@/components/form/rules'

export default {
  name: 'CSelect',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    label: String,
    name: String,
    placeholder: String,
    data: Array,
    rules: [Array, String],
    initialValue: {},
  },
  computed: {
    rulesArray: function () {
      return rulesToArray(this.rules, this.label)
    },
  },
}
</script>

<style scoped>

</style>
