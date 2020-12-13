<template>
  <a-modal
      v-model="visible"
      :title="modalProps.title"
      :okText="modalProps.okText ? modalProps.okText : '确定'"
      :cancelText="modalProps.cancelText ? modalProps.cancelText : '取消'"
      @ok="handleSubmit"
      @afterClose="close"
      forceRender
      :confirmLoading="confirmLoading"
  >
    <a-form layout="horizontal" :form="form" :label-col="{span: 6}" :wrapper-col="{span: 18}" @submit="handleSubmit">
      <slot/>
    </a-form>
  </a-modal>
</template>
<script>
import {sync} from '@/utils/sync'

export default {
  props: {
    submit: {
      type: Function,
    },
  },
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
      confirmLoading: false,
    }
  },
  methods: {
    open(action, title, {values}) {
      console.info(123)
      this.visible = true
      this.modalProps.title = title
      this.action = action
      this.values = values
      const keys = {}
      for (const i in this.form.getFieldsValue()) {
        keys[i] = values[i]
      }
      this.form.setFieldsValue(keys)
    },
    close() {
      this.visible = false
      this.form.resetFields()
    },
    handleChange(name, value) {
      this.form.setFieldsValue({[name]: value})
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err && this.submit) {
          this.confirmLoading = true
          sync(async () => {
            await this.submit(values, this)
            this.close()
          }, false).finally(() => this.confirmLoading = false)
        }
      })
    },
  },
}
</script>

<style lang="less">
.ant-modal-body {
  .ant-form-item:last-child {
    margin-bottom: 0 !important;
  }
}
</style>
