<template>
  <div>
    <CTable
        :columns="columns"
        index="user_id"
        :api="adminUserListApi"
        ref="table"
        :format="(v) => ({...v, status: parseInt(v.status) || undefined})"
    >
      <template #button>
        <a-button type="primary" @click="onCreate" icon="plus">
          添加用户
        </a-button>
      </template>
      <template #form>
        <CInput name="user_id" placeholder="请输入用户ID"/>
        <CInput name="username" placeholder="请输入用户名称"/>
        <CSelect
            name="status"
            placeholder="请选择状态"
            width="120px"
            :data="[{label: '启用', value: 1},{label: '停用', value: 2}]"
        />
      </template>
    </CTable>
    <CModal ref="form" :submit="submitForm">
      <Form/>
    </CModal>
  </div>
</template>

<script>
import {
  adminUserCreateApi,
  adminUserDeleteApi,
  adminUserListApi,
  adminUserOfflineApi,
  adminUserOnlineApi,
  adminUserUpdateApi,
} from '@/services'
import {CInput, CModal, CSelect, CTable} from '@/components'
import Form from './inner/Form.vue'
import {buttonsRender, statusRender} from '@/utils'

export default {
  components: {CSelect, CInput, CModal, CTable, Form},
  data() {
    return {
      adminUserListApi,
      data: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'user_id',
          sorter: true,
        },
        {
          title: '用户名称',
          dataIndex: 'username',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
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
            {action: 'online', title: '启用', show: item => item.status === 2, popConfirm: '确定需要启用该用户?'},
            {action: 'offline', title: '停用', show: item => item.status === 1, popConfirm: '确定需要停用该用户?'},
            {action: 'delete', title: '删除', show: item => item.status === 2, popConfirm: '删除数据无法恢复,确定需要删除该用户?'},
          ], this),
        },
      ],
    }
  },
  methods: {
    async submitForm(values, modal) {
      if (modal.action === 'create') {
        await adminUserCreateApi(values)
        this.$notification.success({
          message: '温馨提示',
          description: '添加成功',
        })
      } else {
        await adminUserUpdateApi(values)
        this.$notification.success({
          message: '温馨提示',
          description: '编辑成功',
        })
      }

      this.$refs.table.fetch()
    },
    onCreate() {
      this.$refs.form.open('create', '添加用户信息', {values: {}})
    },
    async btnClick({action, data}) {
      switch (action) {
        case 'offline':
          await adminUserOfflineApi({user_id: data.user_id})
          this.$notification.success({
            message: '操作提醒',
            description: '停用成功',
          })
          this.$refs.table.fetch()
          break
        case 'online':
          await adminUserOnlineApi({user_id: data.user_id})
          this.$notification.success({
            message: '操作提醒',
            description: '启用成功',
          })
          this.$refs.table.fetch()
          break
        case 'delete':
          await adminUserDeleteApi({user_id: data.user_id})
          this.$notification.success({
            message: '操作提醒',
            description: '删除成功',
          })
          this.$refs.table.fetch()
          break
        case 'update':
          this.$refs.form.open('update', '修改用户信息', {values: {...data, password: ''}})
          break
      }
    },
  },
}
</script>
