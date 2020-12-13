<template>
  <div>
    <CTable
        :columns="columns"
        :api="api"
        index="id"
        ref="table"
        :format="(v) => ({...v, status: parseInt(v.status) || undefined})"
    >
      <template slot="button">
        <a-button type="primary" @click="onCreate" icon="plus">
          添加应用
        </a-button>
      </template>
      <template slot="form">
        <CInput name="app_id" placeholder="请输入应用ID"/>
        <CInput name="app_name" placeholder="请输入应用名称"/>
        <CSelect
            name="status"
            placeholder="请选择状态"
            width="120px"
            :data="[{label: '启用', value: 1},{label: '停用', value: 2}]"
        />
      </template>
    </CTable>
    <CModal ref="form" :submit="submitForm">
      <Form @change="handleChange"/>
    </CModal>
  </div>
</template>

<script>
import {
  adminAppListApi,
  adminAppOfflineApi,
  adminAppOnlineApi,
  adminAppUpdateApi,
  adminAppCreateApi,
  adminAppDeleteApi,
} from '@/services'
import {sync} from '@/utils/sync'
import CSelect from '@/components/form/CSelect.vue'
import CInput from '@/components/form/CInput.vue'
import {CModal, CTable} from '@/components'
import Form from './inner/Form.vue'
import {statusRender, buttonsRender} from '@/utils'

export default {
  components: {CSelect, CInput, CModal, Form, CTable},
  data() {
    return {
      api: adminAppListApi,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          sorter: true,
        },
        {
          title: '应用名称',
          dataIndex: 'app_name',
        },
        {
          title: '应用ID',
          dataIndex: 'app_id',
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: statusRender(1, this.$createElement),
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          align: 'center',
        },
        {
          title: '修改时间',
          dataIndex: 'updated_at',
          align: 'center',
        },
        {
          title: '操作',
          customRender: buttonsRender([
            {action: 'update', title: '编辑'},
            {action: 'offline', title: '停用', show: v => v.status === 1, confirm: '确认需要停用该应用?'},
            {action: 'online', title: '启用', show: v => v.status === 2, confirm: '确认需要启用该应用?'},
            {action: 'delete', title: '删除', show: item => item.status === 2, popConfirm: '删除数据无法恢复,确定需要删除该应用?'},
          ], this),
        },
      ],
    }
  },
  methods: {
    async submitForm(values, modal) {
      if (modal.action === 'create') {
        await adminAppCreateApi(values)
        this.$notification.success({
          message: '温馨提示',
          description: '添加成功',
        })
      } else {
        await adminAppUpdateApi(values)
        this.$notification.success({
          message: '温馨提示',
          description: '编辑成功',
        })
      }

      this.$refs.table.fetch()
    },
    onCreate() {
      this.$refs.form.open('create', '添加应用信息', {values: {}})
    },
    handleChange(name, value) {
      this.$refs.form.form.setFieldsValue({[name]: value})
    },
    async btnClick({action, data}) {
      switch (action) {
        case 'offline':
          await adminAppOfflineApi({id: data.id})
          this.$notification.success({
            message: '操作提醒',
            description: '停用成功',
          })
          this.$refs.table.fetch()
          break
        case 'online':
          await adminAppOnlineApi({id: data.id})
          this.$notification.success({
            message: '操作提醒',
            description: '启用成功',
          })
          this.$refs.table.fetch()
          break
        case 'delete':
          await adminAppDeleteApi({id: data.id})
          this.$notification.success({
            message: '操作提醒',
            description: '删除成功',
          })
          this.$refs.table.fetch()
          break
        case 'update':
          this.$refs.form.open('update', '编辑应用信息', {values: {...data}})
          break
      }
    },
  },
}
</script>
