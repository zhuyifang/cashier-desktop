<template>
  <q-header bordered class="fixed bg-grey-10">
    <q-bar dark>
      <span class="text-grey-4">{{ $store.state.mall.name }}</span>
      <q-space/>
      <q-btn dense flat round icon="lens" size="8.5px" color="red"/>
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow"/>
      <q-btn dense flat round icon="lens" size="8.5px" color="green"/>
    </q-bar>
  </q-header>
</template>

<script>
export default {
  name: "layoutHeader"
}
</script>

<style scoped>

</style>
