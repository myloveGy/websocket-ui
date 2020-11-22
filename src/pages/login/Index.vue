<template>
  <div id="bigBox">
    <h1>登录</h1>
    <div class="inputBox">
      <div class="inputText">
        <span class="iconfont icon-nickname"></span>
        <input type="text" placeholder="Username" v-model="form.username" autocomplete="off"/>
      </div>
      <div class="inputText">
        <span class="iconfont icon-visible"></span>
        <input type="password" placeholder="Password" v-model="form.password" autocomplete="new-password"/>
      </div>
    </div>
    <input class="loginButton" type="button" value="Login" @click="submit"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class Index extends Vue {

  private bodyHtml: HTMLBodyElement | null = null

  private form: { username: string, password: string } = {username: '', password: ''}

  private beforeCreate() {
    this.bodyHtml = document.querySelector('body')
    if (this.bodyHtml) {
      this.bodyHtml.setAttribute('class', 'main-body')
    }
  }

  private destroyed() {
    if (this.bodyHtml) {
      this.bodyHtml.setAttribute('class', '')
    }
  }

  private submit() {
    if (!this.form.username || !this.form.password) {
      alert('请输入账号和密码进行登录')
      return
    }

    alert(this.form)
  }
}
</script>

<style scoped lang="less">

#bigBox {
  margin: 200px auto 0 auto;
  padding: 20px 50px;
  background-color: #00000090;
  width: 400px;
  height: 300px;
  border-radius: 10px;
  text-align: center;

  h1 {
    color: white;
  }

  .inputBox {
    margin-top: 50px;
  }

  .inputBox .inputText {
    margin-top: 20px;

    span {
      color: white;
      font-size: 20px;
    }

    input {
      border: 0;
      padding: 10px 10px;
      border-bottom: 1px solid white;
      background-color: #00000000;
      color: white;
    }
  }

  .loginButton {
    margin-top: 30px;
    width: 150px;
    height: 30px;
    color: white;
    border: 0;
    border-radius: 20px;
    background-image: linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%);
  }
}
</style>
