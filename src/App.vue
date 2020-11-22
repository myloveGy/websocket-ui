<template>
  <div id="app">
    <p>
      <router-link to="/">
        首页
      </router-link>
      <router-link to="/about">
        关于
      </router-link>
      <router-link to="/login">
        登录
      </router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class App extends Vue {
}
</script>
