<template>
  <div>
    <CInput
        name="user_id"
        placeholder="请输入用户名称"
        type="hidden"
        simple
    />
    <CInput
        name="username"
        placeholder="请输入用户名称"
        label="用户名称"
        rules="required"
    />
    <CInput
        name="phone"
        placeholder="请输入手机号码"
        label="手机号码"
        rules="required"
    />
    <CInput
        name="password"
        placeholder="请输入密码"
        label="用户密码"
        type="password"
    />
  </div>
</template>

<script>
import CInput from '@/components/form/CInput.vue'

export default {
  name: 'Form',
  components: {CInput},
}
</script>
