<template>
   <div>
      <div class="boutique">
       
         <img class="bgcImg" :src="info.boutique.coverImgUrl" alt="" />
         
         <div class="cover">
            <img :src="info.boutique.coverImgUrl" alt="" />
         </div>
       
         <div class="info">
            <div class="introduce">
               <el-button class="title">
                  <i class="iconfont">&#xe613;</i>
                  精品歌单
               </el-button>
              
               <p class="name">{{ info.boutique.name }}</p>
           
               <p class="copywriter">{{ info.boutique.copywriter }}</p>
            </div>
         </div>
      </div>

      <div class="songListType">
      <el-popover
        ref="popover"
        placement="bottom-start"
        :width="400"
        trigger="click"
      >
        <template #reference>
          <el-button class="typeSelect">
            <span>{{ info.selectPlaylistName }}</span>
            <el-icon>

              <RouterView />

            </el-icon>
          </el-button>
        </template>
        <el-button
        :class="{ list: true, select: selectPlaylistName === p.name }"
          v-for="(p, index) in playlistTag"
          :key="index"
          @click="changeType(index)"
        >
          {{ p.name }}
        </el-button>
      </el-popover>

      <!-- 热门类型 -->
      <div class="hotType">
        <el-button
          :class="{ type: true, select: selectPlaylistName === h.name }"
          v-for="(h, index) in hotTypeTag"
          :key="index"
          @click="changeHot(index)"
          >{{ h.name }}</el-button
        >
      </div>
    </div>
    <!-- 对应分类的歌单详细 -->
    <div class="typeResult">
      <ul class="lists">
        <li
          class="list"
          v-for="(h, index) in handpick"
          :key="index"
          @click="toPlaylistDetails(h.id)"
        >
          <el-image :src="h.coverImgUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ h.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="handpick.length"
        background
        
        layout="prev, pager, next"
        :total="info.pages * 10"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 返回顶部的按钮 -->
    <!-- <el-backtop target=".songList" :bottom="100"></el-backtop> -->
  
   </div>
</template>

<script setup>
import { reactive, toRefs, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { boutique, playlistTag, hotTypeTag, handpick } from '../../../api'

const router = useRouter()
const info = reactive({
  playlistTag:[],
  boutique:[],
  hotTypeTag:[],
  handpick:[],
  selectPlaylistName:'华语',
  pagination:0,
  pages:0,
  songList:''
})


const getBoutique = async () =>{
  let res = await boutique()
  info.boutique = res.data.playlists[0]
  console.log(info.boutique)
}
const getPlaylistTag = async () => {
  let res =await playlistTag()
  info.playlistTag = res.data.sub
}
const getHotTypeTag = async () => {
      let res = await hotTypeTag()
      info.hotTypeTag = res.data.tags
    }
const getHandpick = async () => {
     let res = await handpick(info.selectPlaylistName , info.pagination *50)
     info.handpick = res.data.playlists
     info.pages = Math.ceil(res.data.total/50)
    //  info.songList.scrolltop = 0
}

const changeType = (i) => {
  info.pagination = 0
  info.selectPlaylistName = info.playlistTag[i].name
}
const changeHot = (i) => {
  info.pagination = 0
  info.selectPlaylistName = info.hotTypeTag[i].name
} 

const currentChange = (p ) => {
  info.pagination = p - 1
}
const toPlaylistDetails = (id) => {
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

getHotTypeTag()
getPlaylistTag()
getBoutique()
getHandpick()
</script>

<style lang="scss" scoped>
.boutique {
   max-width: 1250px;
   min-width: 992px;
   height: 175px;
   margin: auto;
   border-radius: 10px;
   display: flex;
   box-shadow: 1px 1px 10px 1px rgb(209, 209, 209) inset;
   position: relative;
   overflow: hidden;

   .bgcImg {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-80px);
      filter: blur(30px) brightness(70%);
   }

   .cover {
      z-index: 2;
      margin: 12.5px;

      img {
         width: 150px;
         height: 150px;
         border-radius: 10px;
      }
   }

   .info {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      display: flex;
      z-index: 2;

      .introduce {
         display: flex;
         flex-direction: column;

         .title {
            width: 110px;
            height: 35px;
            border-radius: 100px;
            border: 1px solid #d59654;
            line-height: 35px;
            color: #d59654;
            font-size: 17px;
            margin: 20px 10px 15px 10px;
            background-color: transparent;

            i {
               font-size: 20px;
            }
         }

         p.name {
            font-size: 18px;
            color: white;
         }

         p.copywriter {
            margin-top: 20px;
            margin-left: 20px;
            color: #bbb;
            font-size: 14px;
         }
      }
   }
}

.songListType {
  max-width: 1250px;
  min-width: 992px;
  height: 68px;
  margin: auto;
  box-sizing: border-box;
  padding: 14px 0;
  display: flex;
  position: relative;
  align-items: center;
  .typeSelect {
    height: 28px;
    border-radius: 20px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .hotType {
    display: flex;
    position: absolute;
    right: 0;
    .type {
      text-align: center;
      padding: 0 10px;
      height: 28px;
      border-radius: 20px;
      box-sizing: border-box;
    }
    .select {
      color: #eb4f4f;
      background-color: #fcebeb;
    }
  }
}
.typeResult {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
}

</style>