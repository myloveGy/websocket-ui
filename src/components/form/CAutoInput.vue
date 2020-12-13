<template>
  <a-form-item :label="label">
    <a-input-search
        @search="onSearch"
        :type="type"
        :placeholder="placeholder"
        enterButton="更新"
        v-decorator="[name, {rules: rulesArray, initialValue}]"
    />
  </a-form-item>
</template>

<script>
import {rulesToArray} from '@/components/form/rules'
import {password} from '@/utils'

export default {
  name: 'CAutoInput',
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
    length: {
      default: 32,
      type: Number,
    },
  },
  computed: {
    rulesArray: function () {
      return rulesToArray(this.rules, this.label)
    },
  },
  methods: {
    onSearch() {
      this.$emit('change', this.name, password(this.length))
    },
  },
}
</script>
