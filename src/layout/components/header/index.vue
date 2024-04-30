<template>
  <header>
    <div class="menu-collapse">
      <img src="@/assets/images/logo.svg" alt="">
    </div>

    <div class="avatar" @click="login"></div>
    
  </header>
</template>

<script setup>
import { loginApi } from '@/api/login'
import { setToken } from '@/utils/auth'

const login = () => {
  const params = {
    loginName: 'admin',
    password: 'FoVa@20242024'
  }

  loginApi(params)
    .then((res) => {
      if (res.data) {
        setToken(res.data)
        location.reload()
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 50px;
  display: flex;
  padding: 0 15px;
  justify-content: space-between;
  place-items: center;
  line-height: 1.5;
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.03);
}

.menu-collapse{
  width: 25px;
  height: 25px;
  img{
    width: 100%;
    height: 100%;
  }
}

.avatar{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #000;
}

// @media (min-width: 1024px) {
//   .menu-collapse{
//     display: none;
//   }
// }
</style>
