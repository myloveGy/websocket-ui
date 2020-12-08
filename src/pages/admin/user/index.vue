<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit" style="margin-bottom: 16px">
      <CInput name="user_id" placeholder="请输入用户ID"/>
      <CInput name="username" placeholder="请输入用户名称" :rules="[{ required: true, message: 'Please input your note!' }]"/>
      <CSelect
          name="status"
          placeholder="请选择状态"
          width="120px"
          :data="[{label: '启用', value: 1},{label: '停用', value: 2}]"
      />
      <a-form-item>
        <a-button type="primary" html-type="submit">
          搜索
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
          重置
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
        :columns="columns"
        :row-key="record => record.user_id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >
      <template slot="status" slot-scope="status">
        <a-tag color="#f50" v-if="status === 2">
          停用
        </a-tag>
        <a-tag color="#87d068" v-else>
          启用
        </a-tag>
      </template>
      <template slot="action" slot-scope="user">
        <a @click="onClick({action: 'update', data: user})">编辑</a>
        <a-divider type="vertical"/>
        <template v-if="user.status === 2">
          <a @click="onClick({action: 'online', data: user})">启用</a>
          <a-divider type="vertical"/>
        </template>
        <a v-else @click="onClick({action: 'offline', data: user})">停用</a>
      </template>
    </a-table>
    <CModal ref="form"/>
  </div>
</template>

<script>
import {adminUserListApi, adminUserOfflineApi, adminUserOnlineApi} from '@/services'
import {sync} from '@/utils/sync'
import CSelect from '@/components/form/CSelect.vue'
import CInput from '@/components/form/CInput.vue'
import CModal from '@/components/CModal.vue'

const columns = [
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
    scopedSlots: {customRender: 'action'},
  },
]

export default {
  components: {CSelect, CInput, CModal},
  data() {
    return {
      data: [],
      pagination: {
        showTotal: (total) => `总数${total}`,
      },
      loading: false,
      columns,
      form: this.$form.createForm(this, {name: 'horizontal_login'}),
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = {...this.pagination}
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        page_size: pagination.pageSize,
        page: pagination.current,
        sort_field: sorter.field,
        sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
        ...filters,
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.fetch(values)
        }
      })
    },
    handleReset() {
      this.form.resetFields()
      this.fetch()
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
            this.fetch()
          })
          break
        case 'online':
          sync(async () => {
            await adminUserOnlineApi({user_id: data.user_id})
            this.$notification.success({
              message: '操作提醒',
              description: '启用成功',
            })
            this.fetch()
          })
          break
        case 'update':
          this.$refs.form.open({title: '修改用户信息', action: 'update', values: {...data}})
          break
      }
    },
    fetch(params = {}) {
      console.log('params:', params)
      this.loading = true
      adminUserListApi(params).then(({items, pagination}) => {
        this.data = items
        this.pagination = {...this.pagination, ...pagination}
      }).finally(() => this.loading = false).catch(e => {
        console.info(123)
      })
    },
  },
}
</script>
