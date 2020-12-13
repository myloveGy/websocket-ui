<template>
  <div>
    <div style="height: auto; overflow: hidden">
      <slot name="button"/>
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
        :columns="columns"
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

<script>
import {CInput, CSelect} from '@/components/form'
import {stringify} from 'qs'

export default {
  props: {
    columns: {
      default: [],
      type: Array,
    },
    index: [String, Function],
    api: Function,
    format: Function,
  },
  components: {CInput, CSelect},
  data() {
    return {
      data: [],
      loading: false,
      pagination: {
        showTotal: (total) => `总数${total}`,
      },
      form: this.$form.createForm(this, {name: 'search-form'}),
    }
  },
  mounted() {
    const query = this.format ? this.format(this.$route.query) : this.$route.query
    this.form.setFieldsValue(query)
    this.fetch(query)
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
        const query = stringify({
          ...params,
          ...this.form.getFieldsValue(),
        })

        if (query !== stringify(this.$route.query)) {
          this.$router.push(`${this.$route.path}?${query}`)
        }

        if (params.hasOwnProperty('page')) {
          params.page = parseInt(params.page)
        }

        if (params.hasOwnProperty('page_size')) {
          params.page_size = parseInt(params.page_size)
        }

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
