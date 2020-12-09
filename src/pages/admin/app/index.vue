<template>
  <div>
    <CTable :columns="columns" :api="api" index="user_id" ref="table">
      <template slot="form">
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
  adminAppListApi,
  adminUserOfflineApi,
  adminUserOnlineApi,
  adminUserUpdateApi,
  adminUserCreateApi,
} from '@/services'
import {sync} from '@/utils/sync'
import CSelect from '@/components/form/CSelect.vue'
import CInput from '@/components/form/CInput.vue'
import {CModal, CTable} from '@/components'
import Form from './inner/Form.vue'

export default {
  components: {CSelect, CInput, CModal, Form, CTable},
  data() {

    return {
      api: adminAppListApi,
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
          scopedSlots: {customRender: 'status'},
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
          render: [
            {title: '启用'},
          ],
          customRender: (row, index) => {
            const data = [
              <a onClick={() => this.onClick({action: 'update', data: row})}>编辑</a>,
              <a-divider type="vertical"/>,
            ]

            if (row.status === 1) {
              data.push(<a onClick={() => this.onClick({action: 'offline', data: row})}>停用</a>)
            } else {
              data.push(<a onClick={() => this.onClick({action: 'online', data: row})}>启用</a>)
            }

            return data
          },
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
    onClick({action, data}) {
      switch (action) {
        case 'offline':
          sync(async () => {
            await adminUserOfflineApi({user_id: data.user_id})
            this.$notification.success({
              message: '操作提醒',
              description: '停用成功',
            })
            this.$refs.table.fetch()
          })
          break
        case 'online':
          sync(async () => {
            await adminUserOnlineApi({user_id: data.user_id})
            this.$notification.success({
              message: '操作提醒',
              description: '启用成功',
            })
            this.$refs.table.fetch()
          })
          break
        case 'update':
          this.$refs.form.open('update', '修改用户信息', {values: {...data, password: ''}})
          break
      }
    },
  },
}
</script>
