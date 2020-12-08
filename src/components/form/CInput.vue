<template>
  <a-form-item :label="label" v-show="!simple">
    <a-input :type="type" v-decorator="[name, {rules: rulesArray, initialValue}]" :placeholder="placeholder"/>
  </a-form-item>
</template>

<script>
import {rulesToArray} from '@/components/form/rules'

export default {
  name: 'CInput',
  props: {
    name: String,
    placeholder: String,
    label: {default: '', type: String},
    rules: [Array, String],
    initialValue: {},
    type: {
      default: 'text',
      type: String,
    },
    simple: {
      default: false,
      type: Boolean,
    },
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
