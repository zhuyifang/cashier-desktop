<template>
  <q-page class="bootstrap">
    <h4 class="q-py-md q-ma-none text-blue-1 text-center size1">欢迎使用零售宝</h4>
    <q-stepper
      class="q-mx-lg"
      v-model="step"
      ref="stepper"
      color="primary"
      done-color="positive"
      animated
      :transition-duration="200"
    >
      <q-step
        :name="1"
        :title="currentMallName"
        prefix="1"
        :done="step > 1"
      >
        <q-select
          v-model="step1.mall"
          :options="mallList"
          label="请选择门店"/>
      </q-step>
      <q-step
        :name="2"
        title="收银设置"
        prefix="2"
        :done="step > 2"
      >
        <setting-tab-component @softConfig="setSoftConfig"/>
      </q-step>
      <q-step
        :name="3"
        title="完成设置"
        class="text-center"
        prefix="3"
        :done="step > 3"
      >
        零售宝已经收集到足够多的信息,可以开始为您服务了<br/>
        点击完成即可开始提供收银服务啦!<br/>
        当前选定的店铺为:
        <h4 class="text-positive" v-text="currentMallName"></h4>
        <div class="text-center" v-text="step3.progressLabel"></div>
        <q-linear-progress v-if="step3.progress>0" size="25px" :value="step3.progress" color="positive">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="positive" :label="progressLabel"/>
          </div>
        </q-linear-progress>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="text-right">
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="返回" class="q-ml-sm"/>
          <q-btn class="q-ml-md" :disable="stepFinish" @click="next" color="primary"
                 :label="step === 3 ? '完成' : '下一步'"/>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script>
import api from '../../api/api'
import SettingTabComponent from "components/SettingTabComponent.vue";

export default {
  name: "bootstrapPage",
  components: {SettingTabComponent},
  computed: {
    mallList() {
      return this.step1.mallData.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    },
    stepFinish() {
      let status = false
      switch (this.step) {
        case 1:
          status = this.step1.mall === null
      }
      return status
    },
    currentMallName() {
      return this.step1.mall === null ? '选择门店' : this.step1.mall.label
    },
    progressLabel() {
      return (this.step3.progress*100) + '%'
    }
  },
  data() {
    return {
      step: 1,
      step1: {
        mall: null,
        mallData: [],
      },
      step2: {
        softConfig: null
      },
      step3: {
        progress: 0,
        progressLabel: ''
      }
    }
  },
  created() {
    window.$$ = this
    this.getMallList()
  },
  methods: {
    async getMallList() {
      let {data} = await api.mallList()
      this.step1.mallData = data
    },
    setSoftConfig(v) {
      console.log('setSoftConfig', v)
    },
    async next() {
      if (this.step < 3) {
        return this.$refs.stepper.next()
      }

      let sync = new this.$sync(this.step1.mall.value)
      await sync.onProcess((arg) => {
        this.step3.progress = arg.progress / 100
        this.step3.progressLabel = arg.name ? '正在处理商品:' + arg.name : null
        console.log('onProcess', arg)
      }).start()
      try {
        await this.getSetting()
      } catch (e) {
        this.$q.notify({type: 'negative',message:e.message})
      }


      this.$q.dialog({
        title: '设置成功',
        message: '现在您可以登录收银员账号开始收银啦!',
        persistent: true
      }).onOk(() => {
        this.$store.commit('user/logout')
        this.$router.replace('/login')
      })

    },
    async getSetting() {
      let res = await api.mallSetting(this.step1.mall.value)
      console.log(res)
      if (res.code !== 0) {
        throw new Error(res.msg)
      }
      this.$store.commit('mall/updateMutation', {
        id: this.step1.mall.value,
        name: this.step1.mall.label,
        setting: res.data.setting
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.bootstrap {
  background: #222131;

  .q-stepper {
    height: calc(100vh - 100px);

    ::v-deep(.q-stepper__step-inner) {
      height: calc(100vh - 230px);
    }
  }
}

</style>
