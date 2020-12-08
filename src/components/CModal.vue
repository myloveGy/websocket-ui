<template>
  <a-modal
      v-model="visible"
      :title="modalProps.title"
      :okText="modalProps.okText ? modalProps.okText : '确定'"
      :cancelText="modalProps.cancelText ? modalProps.cancelText : '取消'" @ok="submit" @afterClose="close" forceRender>
    <a-form layout="horizontal" :form="form" :label-col="{span: 6}" :wrapper-col="{span: 18}" @submit="submit">
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
      <CSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          :data="[{label: '启用', value: 1},{label: '停用', value: 2}]"
          rules="required"
      />
    </a-form>
  </a-modal>
</template>
<script>
import CSelect from '@/components/form/CSelect.vue'
import CInput from '@/components/form/CInput.vue'

export default {
  components: {CSelect, CInput},
  data() {
    return {
      visible: false,
      action: 'create',
      form: this.$form.createForm(this, {name: 'modal-form'}),
      modalProps: {
        title: '',
        okText: '',
        cancelText: '',
      },
      values: {},
    }
  },
  methods: {
    open({action, title, values}) {
      this.visible = true
      this.modalProps.title = title
      this.action = action
      this.values = values
      const keys = {}
      for (const i in this.form.getFieldsValue()) {
        keys[i] = values[i]
      }
      console.info('keys', keys, values)
      this.form.setFieldsValue(keys)
    },
    close() {
      this.form.resetFields()
    },
    submit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.info(13, values)
        }
      })
    },
  },
}
</script>
