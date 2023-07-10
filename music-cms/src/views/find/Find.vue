<template>
    <div>
 <el-main>
            <div class="nav-music">
                    <el-menu :default-active="defaultActive"
                     class="el-menu-demo" 
                    
                    :default-openeds="['/find',]" router
                    >
                        <el-menu-item index="/find/recommend">个性推荐</el-menu-item>
                        <el-menu-item index="/find/list">歌单</el-menu-item>
                        <el-menu-item index="/find/thecharts">排行榜</el-menu-item>
                        <el-menu-item index="/find/singer">歌手</el-menu-item>
                           
                       
                    </el-menu>
                </div>
                <RouterView />
           </el-main>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.el-menu-demo {
    height: 60px;
    width: calc(100vw - 300px);
    display: flex;
}
.nav-music{
    min-width: calc(100vw - 200px);
    
}
.el-main{min-height: calc(100vh - 120px);}
.el-nav{
width:  calc(100vw - 300px);
}
</style>