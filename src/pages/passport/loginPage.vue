<template>
  <q-page class="login">
    <div class="row q-col-gutter-none">
      <div class="col-8 login-left text-grey-3">
        left
      </div>
      <div class="col-4 login-right q-pa-md">
        <h4 class="text-center">{{ mall.id ? '收银员' : '管理员' }}登录</h4>
        <q-form class="q-gutter-y-md column">
          <q-input ref="username" autocomplete='username' outlined v-model="username" label="用户名"/>
          <q-input ref="password" @keydown.enter="login" autocomplete='current-password' outlined type="password" v-model="password" label="密码"/>
          <div class="row">
            <div class="col"><span class="link">忘记密码?</span></div>
            <div class="col text-right"><span class="link">免费注册</span></div>
          </div>
          <q-btn @click="login" size="lg" color="accent" label="登录"/>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import api from '../../api/api'
import base64 from 'base-64'
export default {
  name: "loginPage",
  computed: {
    mall() {
      return this.$store.state.mall
    }
  },
  data() {
    return {
      username: 'shop-admin',
      password: '123456'
    }
  },
  created() {

  },
  methods: {
    async login() {
      if(!this.username){
        this.$q.notify({type: 'negative', message: '请输入账号', timeout: 1000})
        return this.$refs.username.focus()
      }
      if(!this.password){
        this.$q.notify({type: 'negative', message: '请输入密码', timeout: 1000})
        return this.$refs.password.focus()
      }
      let resUser = await api.login({
        mallId: this.mall.id?base64.encode(this.mall.id):null ,
        username: this.username,
        password: this.password
      })
      console.log(resUser)
      //

      if (resUser.code === 0) {
        this.$store.commit('user/login', {
          id: resUser.data.user.id,
          nickname: resUser.data.user.nickname,
          mobile: resUser.data.user.mobile,
          accessToken: resUser.data.user.access_token
        })
        this.$q.notify('欢迎光临')
        if (!this.mall.id) { // 首次登录
          await this.$router.replace('/bootstrap')
        } else {
          await this.$router.replace('/workbench')
        }
      }else{
        this.$q.notify({type: 'negative',message:resUser.msg})
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background: #222131;
}

.login-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-right {
  background-color: #fff;
  height: calc(100vh - 33px);

  .link {
    cursor: pointer;
    color: #4c4c4c;

    &:hover {
      color: #0f0f0f;
    }
  }

}
</style>
