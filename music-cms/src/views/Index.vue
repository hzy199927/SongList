<template>

        <el-container>
            <el-header>Header
                <h2>网易云音乐</h2>
            </el-header>
            <el-aside width="200px" heigth="100vh">
                <el-row class="tac">
                    <el-col :span="24">
                        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">

                            <el-menu-item index="/index">
                                <el-icon>
                                    <Service />
                                </el-icon>
                                <span>发现音乐</span>
                            </el-menu-item>
                            <el-menu-item index="/video">
                                <el-icon>
                                    <Platform />
                                </el-icon>
                                <span>视频</span>
                            </el-menu-item>
                            <el-menu-item index="/like">
                                <el-icon>
                                    <StarFilled />
                                </el-icon>
                                <span>收藏</span>
                            </el-menu-item>
                            <el-menu-item index="find">
                                <el-icon>
                                    <Pointer />
                                </el-icon>
                                <span>每日推荐</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main>Main</el-main>

            <el-footer>Footer</el-footer>

        </el-container>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>