<template>
  <el-container>
    <el-header>
      <HeaderBar></HeaderBar>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <NavBar></NavBar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>
      <FooterBar></FooterBar>
    </el-footer>
  </el-container>
</template>

<script>
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: { HeaderBar, FooterBar, NavBar },
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  user-select: none;
}

li {
  list-style: none;
}

img {
  vertical-align: top;
  border: none;
}

a {
  color: #000000;
  text-decoration: none;
}
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 10px;
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
}
/*定义滚动条轨道
    内阴影+圆角*/
*::-webkit-scrollbar-track {
  border-radius: 10px;
}
/*定义滑块
    内阴影+圆角*/
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #cccccc;
}
.router-view {
  height: calc(100vh - 201px);
  overflow: auto;
  ul.lists {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .list {
      box-sizing: border-box;
      margin-bottom: 10px;
      cursor: pointer;
      margin-right: 31px;
      &:nth-child(5n) {
        margin: 0;
      }
      p {
        width: 225px;
        font-size: 15px;
        white-space: normal;
        text-align: left;
        margin-bottom: 20px;
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin: 10px 0 30px;
  }
}
</style>
