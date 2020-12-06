<template>
  <div id="app">
    <router-view v-if="['/login', '/home'].includes($route.path)"></router-view>
    <Index v-else>
      <router-view></router-view>
    </Index>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import Index from './layouts/Index.vue'

@Component({
  components: {
    Index,
  },
})
export default class App extends Vue {
}
</script>
