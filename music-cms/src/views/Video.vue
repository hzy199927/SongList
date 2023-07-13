<template>
    <div class="recommendation">
        <div class="recommendationInfo">
            <div class="logo">
                <img src="@/assets/images/recommendMusic.png" alt="" />
            </div>
            <div class="write">
                <div class="title">每日歌曲推荐</div>
                <div class="intro">根据你的音乐口味生成，每天6:00更新</div>
            </div>
        </div>
        <div class="operate">
            <div class="playAll" @click="playAll">
                <el-icon>
                    <VideoPlay />
                </el-icon> 播放全部
            </div>
            <div class="likeAll"><el-icon>
                    <FolderAdd />
                </el-icon> 收藏全部</div>
        </div>

        <div class="songs">
            <el-table v-if="songs" :data="songs" style="width: 100%" size="mini" empty-text="Loading . . . . . ."
                @row-dblclick="playSong">
                <el-table-column type="index" align="left" width="50">
                </el-table-column>
                <el-table-column width="80">
                    <el-icon>
                        <Download />
                    </el-icon>
                </el-table-column>

                <el-table-column prop="name" label="音乐标题" min-width="200" align="left">
                </el-table-column>

                <el-table-column prop="ar[0].name" label="歌手" min-width="100" align="left">
                    <template #default="scope">
                        <span class="couldSkip" @click="toSingerDetails(scope.row.ar[0].id)">
                            {{ scope.row.ar[0].name }}
                        </span>
                        <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">
                            /
                            <span class="couldSkip" @click="toSingerDetails(a.id)">{{a.name}}</span>
                        </span>
                    </template>
                </el-table-column>


                <el-table-column prop="al.name" label="专辑" min-width="170" align="left">
                    <template #default="scope">
                        <span class="couldSkip" @click="toCollectionDetails(scope.row.al.id)">{{ scope.row.al.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="minuteDt" label="时长" min-width="60" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { recommendation, songUrl } from '@/api'
import { millisecondToMinuteArr, playSingle, playAllSongs } from '@/plugin'


const router = useRouter()
const info = reactive({
    songs: []
})

const getRecommendation = async () => {
    let res = await recommendation()

    millisecondToMinuteArr(res.data.data.dailySongs, 'dt')

    for (let i = 0; i < res.data.data.dailySongs.length; i++) {
        getSongsUrlToPush(res.data.data.dailySongs[i])
    }
    info.songs = res.data.data.dailySongs
    console.log(info.songs);
}

const getSongsUrlToPush = async (target) => {
    let res = await songUrl(target.id)
    target.url = res.data.data[0].url
}

getRecommendation()

</script>

<style lang="scss" scoped>
.recommendation {
    padding: 0 20px;

    .recommendationInfo {
        padding: 0 20px;
        margin: 30px 0 20px;
        display: flex;

        .logo {
            margin-right: 20px;

            img {
                width: 100px;
            }
        }

        .write {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .title {
                font-size: 25px;
                font-weight: bold;
            }

            .intro {
                color: #666;
            }
        }
    }

    .operate {
        padding: 0 30px;
        display: flex;

        .playAll,
        .likeAll {
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

        .playAll {
            background-color: #ec4141;
            color: white;

            &:hover {
                background-color: rgb(228, 32, 32);
            }
        }
    }

    .songs {
        margin: 20px 0;
    }
}
</style>