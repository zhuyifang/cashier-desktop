<template>
  <q-page class="start-up bg-blue">
    <div class="logo-box">
      <q-icon name="point_of_sale" size="5rem" color="white"></q-icon>
      <h1>零售宝</h1>
      <h2>Easy Cashier</h2>
    </div>
    <div class="copyright text-grey-4">小豆芽电子商务</div>
  </q-page>
</template>

<script>

export default {
  name: "startUp",
  mounted () {
    setTimeout(() => {
      window.main.openMainWindow('#/login')
    }, 5000)
  }
}
</script>

<style lang="scss" scoped>
.start-up {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .logo-box {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    flex-direction: column;

    h1 {
      margin: 0;
      padding: 0;
      font-size: 22px;
      line-height: 22px;
      letter-spacing: 5px;
      color: #ffffff;
    }

    h2 {
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 14px;
      color: #ffff00;
    }
  }

  .copyright {
    position: absolute;
    bottom: 50px;
    font-size: 12px;
  }
}
</style>
