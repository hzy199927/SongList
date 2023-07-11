<template>
    <div>
        <div class="official">
            <p class="title" v-if="official.length">官方榜</p>
            <div class="list" v-for="(t, index) in official" :key="index">
                <el-image :src="t.coverImgUrl" alt="">
                    <div slot="placeholder" class="image-slot">
                        <img src="../../../assets/images/loading.png" />
                    </div>
                </el-image>
                <div class="songInfo">
                    <el-table :data="officialSongs[index]" style="width: 100%" :show-header="false" height="195px"
                        size="mini" empty-text="Loading . . . . . ." @row-dblclick="toPlaylistDetails(t.id)">
                        <el-table-column type="index" align="left" width="30">
                        </el-table-column>
                        <el-table-column prop="name" label="歌名" width="600" align="left">
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
                    <p class="more" @click="toPlaylistDetails(t.id)">
                        查看更多<i class="el-icon-arrow-right"></i>
                    </p>
                </div>
            </div>
        </div>

        <div class="global">
            <p class="title" v-if="global.length">全球榜</p>
            <div class="typeResult">
                <ul class="lists">
                    <li class="list" v-for="(g, index) in global" :key="index" @click="toPlaylistDetails(g.id)">
                        <el-image :src="g.coverImgUrl" alt="">
                            <div slot="placeholder" class="image-slot">
                                <img src="../../../assets/images/loading.png" />
                            </div>
                        </el-image>
                        <p class="title">{{ g.name }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { topList , playlistDetails } from '../../../api';
import { reactive,toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const info = reactive({
    official:[],
    officialSongs : [] ,
    global: []
})

const getOfficial = async () => {
    let res = await  topList()
    info.official = res.data.list.slice(0,4)
    for(let i=0 ; i < info.official.length ;i++){
        let id= info.official[i].id
        
    }
}
</script>

<style lang="scss" scoped>
.official {
  max-width: 1250px;
  min-width: 992px;
  display: flex;
  flex-direction: column;
  margin: auto;
  .title {
    font-size: 20px;
    color: #666;
  }
  .list {
    width: 100%;
    height: 225px;
    margin: 20px 0 50px;
    display: flex;
    .el-image {
      width: 187px;
      height: 187px;
      border-radius: 15px;
      margin-right: 30px;
      img {
        width: 187px;
        height: 187px;
      }
    }
    .songInfo {
      width: 1033px;
      .el-table {
        border-radius: 10px;
        &::before {
          height: 0px;
        }
        :deep(tr) {
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
      p.more {
        display: inline-block;
        margin-top: 15px;
        font-size: 14px;
        color: #868686;
        cursor: pointer;
      }
    }
  }
}
.global {
  max-width: 1250px;
  min-width: 992px;
  display: flex;
  flex-direction: column;
  margin: auto;
  .title {
    font-size: 20px;
    color: #666;
    margin-bottom: 20px;
  }
}
</style>