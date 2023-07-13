<template>
    <div class="singerDetails">
        <div class="singerIntroduce">
            <div class="cover">
                <img v-if="info.singerInfo.cover" :src="info.singerInfo.cover" alt="" />
                <img v-if="!info.singerInfo.cover" src="../../../img/back.jpg" alt="" />
            </div>
            <div class="introduce">
                <div class="name">{{ info.singerInfo.name }}</div>
                <div class="operate">
                    <div :class="{ like: true,subscribed:info.subscribed }" @click="toSubSinger">
                        <i v-if="!info.subscribed" class="iconfont">&#xe604;</i>
                        <i v-if="info.subscribed" class="iconfont">&#xe612;</i>
                        {{ info.subscribed ? '已收藏' : '收藏' }}
                    </div>
                    <div class="home">
                        <i class="iconfont">&#xe606;</i>
                        个人主页
                    </div>
                </div>
                <div class="worksIntroduce">
                    <span class="songsCount">单曲数：{{ info.singerInfo.musicSize }}</span>
                    <span class="collectionsCount">专辑数：{{ info.singerInfo.albumSize }}</span>
                    <span class="videoCount">MV数：{{ info.singerInfo.mvSize }}</span>
                </div>
            </div>
        </div>
        <div class="singerContent">
            <el-tabs v-model="info.selectTag">
                <el-tab-pane label="专辑" name="collection">
                    <div class="hotSongs">
                        <div class="cover">
                            <img src="../img/topSongsLogo.png" alt="" />
                        </div>
                        <div class="songs">
                            <div class="title">热门 50 首</div>
                            <el-table :data="info.singerHotSongs" style="width: 100%" :show-header="false" size="mini"
                                :max-height="info.maxHeight" :scrollbar-always-on="true" empty-text="Loading . . . . . ."
                                @row-dblclick="playSong(info.singerHotSongs)">
                                <el-table-column type="index" align="left" min-width="40">
                                </el-table-column>
                                <el-table-column prop="name" label="歌名" min-width="500" align="left">
                                </el-table-column>
                                <el-table-column prop="ar[0].name" label="歌手" align="right">
                                    <template #default="scope">
                                        <span class="couldSkip" @click="toSingerDetails(scope.row.ar[0].id)">
                                            {{ scope.row.ar[0].name }}
                                        </span>
                                        <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">
                                            /
                                            <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                                                a.name
                                            }}</span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 查看更多 -->
                            <div class="seeMore" v-if="info.maxHeight === 390" @click="changeMaxHeight">
                                查看更多
                            </div>
                        </div>
                    </div>
                    <div class="details" v-for="(c, index) in collectionDetails" :key="index"
                        empty-text="Loading . . . . . .">
                        <div class="cover">
                            <img v-if="c.album" :src="c.album.blurPicUrl" />
                            <img v-if="!c.album" src="../../assets/images/loading.png" />
                        </div>
                        <div class="songs">
                            <div class="title">{{ c.album.name }}</div>
                            <el-table :data="c.songs" style="width: 100%" :show-header="false" size="mini"
                                :max-height="maxHeight" :scrollbar-always-on="true" @row-dblclick="playSong(c.songs)">
                                <el-table-column type="index" align="left" min-width="40">
                                </el-table-column>
                                <el-table-column prop="name" label="歌名" min-width="500" align="left">
                                </el-table-column>
                                <el-table-column prop="ar[0].name" label="歌手" align="right">
                                    <template #default="scope">
                                        <span class="couldSkip" @click="toSingerDetails(scope.row.ar[0].id)">
                                            {{ scope.row.ar[0].name }}
                                        </span>
                                        <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">

                                            <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                                                a.name
                                            }}</span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="seeMore" @click="toCollectionDetails(c.album.id)">
                                查看更多
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="MV" name="mv">
                    <ul class="lists infinite-list" :v-infinite-scroll="lazyLoading">
                        <li class="list" v-for="(v, index) in info.singerMV.slice(0, info.time * 20)" :key="index"
                            @click="toVideoDetails(v.id, v.type)">
                            <div class="cover">
                                <el-image :src="v.imgurl" alt="" class="video">
                                    <div slot="placeholder" class="image-slot">
                                        <img src="../../../img/loading.png" />
                                    </div>
                                </el-image>
                                <div class="playCount">
                                    <i class="iconfont">&#xe656;</i>
                                    {{ (v.playCount / 10000).toFixed(1) }}万
                                </div>
                                <!-- 时长 -->
                                <div class="duration">
                                    {{ millisecondToMinute(v.duration) }}
                                </div>
                            </div>
                            <p class="title">{{ v.name }}</p>
                        </li>
                    </ul>
                    <div class="noData" v-if="!info.singerMV.length">暂无数据</div>
                </el-tab-pane>
                <el-tab-pane label="歌手详细" name="details">
                    <div class="singerDetail">{{ info.singerInfo.briefDesc }}</div>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>
  
<!-- <script> !!!!!!!!!!!!!!!! -->
<script setup>

import {
    singerDetails,
    hotSongs,
    singerCollections,
    collectionDetails,
    singerMV,
    songUrl,
    subSinger,
    getSubSinger,
} from '@/api'
import { reactive, toRefs, computed, watch ,onMounted } from 'vue'

// import { useStore } from 'vuex'
import {
    millisecondToMinute,
    millisecondToMinuteArr,
    playAllSongs,
} from '@/plugin'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
// const store = useStore()

const id = computed({
    get() {
        return route.query.id
    },
    set(val) {
        return val
      },
})

const info = reactive({
    singerInfo: {},
    singerHotSongs: [],
    collectionDetails: [],
    singerMV: [],
    selectTag: 'collection',
    maxHeight: 390,
    isMoreMV: false,
    time: 1,
    subscribed: false,
})


const getSingerDetails = async () => {
    
    let res = await singerDetails(id.value)
   
    info.singerInfo = res.data.data.artist
}
getSingerDetails()

const getSingerHotSongs = async () => {
    let res = await hotSongs(id.value)
    millisecondToMinuteArr(res.data.hotSongs, 'dt')
    for (let i = 0; i < res.data.hotSongs.length; i++) {
        getSongsUrlToPush(res.data.hotSongs[i])
    }
    info.singerHotSongs = res.data.hotSongs
    
}



const getSingerCollections = async () => {
    let res = await singerCollections(id.value)
    let idArr = []
    if(res.hotAlbums){
        for (let i = 0; i < res.hotAlbums.length; i++) {
        idArr[i] = res.hotAlbums[i].id
    }
    }
    
    getCollectionDetails(idArr)
}
getSingerCollections()


const getCollectionDetails = async (idArr) => {
    for (let i = 0; i < idArr.length; i++) {
        let res = await collectionDetails(idArr[i])
        millisecondToMinuteArr(res.songs, 'dt')
        for (let i = 0; i < res.songs.length; i++) {
            getSongsUrlToPush(res.songs[i])
        }
        info.collectionDetails[i] = res
    }
}

const getSingerMV = async () => {
    let res = await singerMV(id.value, info.time * 20)
    info.isMoreMV = res.data.hasMore
    info.singerMV = res.data.mvs
}
const getSongsUrlToPush = async (target) => {
    let res = await songUrl(target.id)
    
    target.url = res.data.data[0].url
}

const getSubscribed = async (hint) => {
    let res = await getSubSinger()
    let subIds = []

    res.data.forEach((el) => {
        subIds.push(el.id)
    })
    if (subIds.indexOf(id.value * 1) !== -1) {
        info.subscribed = true
        if (hint) {
            ElMessage({
                message: '收藏成功',
                type: 'success',
                grouping: true,
            })
        }
    } else {
        info.subscribed = false
        if (hint) {
            ElMessage({
                message: '已取消收藏',
                type: 'success',
                grouping: true,
            })
        }
    }
}

const toSubSinger = async () => {
    let t = info.subscribed ? 2 : 1
    let res = await subSinger(id.value, t)
    if (res.code === 200) {
        getSubscribed('hint')
    }
}

const changeMaxHeight = () => {
    info.maxHeight = 99999
}

const toCollectionDetails = (id) => {
    router.push({
        name: 'collectionDetails',
        params: { id },
    })
}

const toSingerDetails = (id) => {
    router.push({
        name: 'singerDetails',
        params: { id },
    })
}

const toVideoDetails = (id, type) => {
    if (type) {
        type = 'video'
    } else {
        type = 'mv'
    }
    router.push({
        name: 'videoDetails',
        params: {
            id,
            type,
        },
    })
}

const lazyLoading = () => {
    if (info.isMoreMV && info.selectTag === 'mv') {
        info.time += 1
        getSingerMV()
    } else {
        if (info.time !== 1) {
            ElMessage({
                message: '暂无更多数据',
                type: 'warning',
            })
        }
    }
}


getSingerHotSongs()




</script>
  
<style lang="scss" scoped>
.singerDetails {
    width: 100%;
    height: calc(100vh - 120px);
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: default;

    .singerIntroduce {
        padding: 32px 18px;
        display: flex;

        .cover {
            margin-right: 20px;

            img {
                width: 187px;
                height: 187px;
                border-radius: 10px;
            }
        }

        .introduce {
            color: #666;

            .name {
                font-size: 25px;
                font-weight: bold;
                color: #000;
                margin: 15px 0;
            }

            .operate {
                display: flex;
                margin: 10px 0;

                .home,
                .like {
                    border: 1px solid #ddd;
                    padding: 8px 15px;
                    border-radius: 50px;
                    font-size: 14px;
                    margin-right: 10px;
                    cursor: pointer;

                    &:hover {
                        background-color: #f7f7f7;
                    }
                }

                .subscribed {
                    i {
                        color: #ec4141;
                    }

                    color: #ec4141;
                    border-color: #ec4141;
                }
            }

            .worksIntroduce {
                margin-left: 30px;
                margin-top: 20px;
                font-size: 14px;

                span {
                    margin: 0 5px;
                }
            }
        }
    }

    .singerContent {
        margin-top: 20px;
        padding: 0 18px;
        box-sizing: border-box;

        :deep(.el-tabs) {
            width: 100%;

            .el-tabs__nav {
                background-color: #fff;

                .el-tabs__active-bar {
                    height: 2px;
                    background-color: #ec4141;
                }

                .is-active {
                    color: black;
                    font-size: 16px !important;
                    font-weight: bold;
                }

                .el-tabs__item {
                    font-size: 14px;

                    &:hover {
                        color: black;
                    }
                }
            }

            .el-tabs__nav-wrap {
                &::after {
                    height: 0;
                }
            }

            .hotSongs,
            .details {
                width: 100%;
                margin: 20px 0 50px;
                display: flex;

                .cover {
                    img {
                        width: 187px;
                        height: 187px;
                        border-radius: 15px;
                        margin-right: 30px;
                    }
                }

                .songs {
                    width: calc(100% - 217px);

                    .title {
                        font-size: 22px;
                        color: #000;
                        font-weight: bold;
                        margin-bottom: 15px;
                    }

                    .el-table {
                        border-radius: 10px;

                        &::before {
                            height: 0px;
                        }

                        tr {
                            height: 37.5px;
                            cursor: pointer;

                            td {
                                font-size: 13px;
                                border-bottom: none;

                                &:nth-child(2n) {
                                    color: #000000;
                                }

                                &:nth-child(2n + 1) {
                                    color: #868686;
                                }
                            }

                            &:nth-child(2n + 1) {
                                background-color: #f8f8f8;
                            }

                            &:hover {
                                background-color: #f4f4f4;

                                & td {
                                    background-color: #f4f4f4;
                                }
                            }
                        }
                    }

                    .el-scrollbar__bar {
                        display: none;
                    }

                    .el-scrollbar__wrap,
                    .el-scrollbar__wrap,
                    .el-scrollbar__wrap--hidden-default {
                        overflow: hidden !important;
                    }

                    .seeMore {
                        margin-top: 10px;
                        font-size: 14px;
                        color: #868686;
                        cursor: pointer;
                    }
                }
            }

            ul.lists {
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
                justify-content: space-around;

                .list {
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    cursor: pointer;
                    position: relative;

                    .cover {
                        position: relative;

                        .playCount {
                            position: absolute;
                            top: 5px;
                            right: 10px;
                            color: white;
                            font-size: 12px;
                        }

                        .duration {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            color: white;
                            font-size: 12px;
                        }
                    }

                    p {
                        width: 285px;
                        font-size: 15px;
                        white-space: normal;
                        text-align: left;
                        margin-bottom: 20px;
                    }
                }
            }

            .singerDetail {
                font-size: 15px;
                color: #373737;
                line-height: 30px;
                letter-spacing: 0.7px;
                text-indent: 2em;
                margin-bottom: 20px;
            }

            .noData {
                font-size: 23px;
                font-weight: bold;
                text-align: center;
            }
        }
    }
}
</style>
  