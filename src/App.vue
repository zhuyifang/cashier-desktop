<template>
  <router-view/>
</template>

<script>
import 'default-passive-events'
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'App',
  created(){
    window.$$ = this
  },
})
</script>
<style>
body {
  -webkit-app-region: drag;
}
button,a,input,textarea,select{
  -webkit-app-region: none;
}
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: rgba(255,255,255,.2);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #272d44;
}

</style>
