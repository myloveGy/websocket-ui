<template>
  <div>
    <div style="height: auto; overflow: hidden">
      <a-form layout="inline" :form="form" @submit="handleSubmit" style="margin-bottom: 16px; float: right">
        <slot name="form"/>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
        :columns="tableColumns"
        :row-key="index"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >
      <slot name="table"/>
    </a-table>
  </div>
</template>

<script type="text/jsx">
import {CInput, CSelect} from '@/components/form'

export default {
  props: {
    columns: {
      default: [],
      type: Array,
    },
    index: [String, Function],
    api: Function,
  },
  components: {CInput, CSelect},
  data() {
    return {
      display: item => <strong>{item}</strong>,
      data: [],
      pagination: {
        showTotal: (total) => `总数${total}`,
      },
      loading: false,
      form: this.$form.createForm(this, {name: 'search-form'}),
    }
  },
  mounted() {
    this.fetch()
  },
  computed: {
    tableColumns: function () {
      const me = this
      return this.columns.map(item => {
        // if (item.hasOwnProperty('render')) {
        //   item.customRender = (row, index) => {
        //     // h gets auto injected here(note that data is now a member function)
        //     return item.render.map(v => <a>123</a>)
        //   }
        // }

        return item
      })
    },
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
      this.form.validateFields((err) => {
        if (!err) {
          this.fetch()
        }
      })
    },
    handleReset() {
      this.form.resetFields()
      this.fetch()
    },
    fetch(params = {}) {
      if (this.api) {
        this.loading = true
        this.api({
          ...params,
          ...this.form.getFieldsValue(),
        }).then(({items, pagination}) => {
          this.data = items
          this.pagination = {...this.pagination, ...pagination}
        }).finally(() => this.loading = false).catch(e => {
          this.$message.error(e.message ? e.message : '服务器繁忙，请稍后再试')
        })
      }
    },
  },
}
</script>
