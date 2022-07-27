<template>
  <q-layout view="lHh lpR fFf" class="non-selectable">
    <layoutHeader/>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import layoutHeader from 'src/components/layout/Header.vue'

export default {
  name: "baseLayout",
  components: {layoutHeader}
}
</script>

<style lang="scss" scoped>

</style>
