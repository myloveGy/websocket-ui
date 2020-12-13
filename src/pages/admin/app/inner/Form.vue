<template>
  <div>
    <CInput name="id" type="hidden" simple/>
    <CInput
        name="app_name"
        placeholder="请输入应用名称"
        label="应用名称"
        rules="required"
    />
    <CAutoInput
        name="app_secret"
        placeholder="请输入应用秘钥"
        label="应用秘钥"
        rules="required"
        @change="(...args) => this.$emit('change', ...args)"
    />
  </div>
</template>

<script>
import {CInput, CAutoInput} from '@/components/form'

export default {
  name: 'Form',
  components: {CInput, CAutoInput},
  props: ['form'],
}
</script>
