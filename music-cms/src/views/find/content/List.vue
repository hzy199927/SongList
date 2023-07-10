<template>
   <div>
      <div class="boutique">
         <!-- 背景图 -->
         <img class="bgcImg" src="../../../img/back.jpg" alt="" />
         <!-- 封面 -->
         <div class="cover">
            <img src="../../../img/back.jpg" alt="" />
         </div>
         <!-- 信息 -->
         <div class="info">
            <div class="introduce">
               <el-button class="title">
                  <i class="iconfont">&#xe613;</i>
                  精品歌单
               </el-button>
               <!-- 名称 -->
               <p class="name">aaa</p>
               <!-- 撰稿人 -->
               <p class="copywriter">bbb</p>
            </div>
         </div>
      </div>

      <div class="songListType">
      <!-- 所有类型（可下拉选择） -->
      <el-popover
        ref="popover"
        placement="bottom-start"
        :width="400"
        trigger="click"
      >
        <template #reference>
          <el-button class="typeSelect">
            <span>aaa</span>
            <el-icon>
              <ArrowRight />
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
          :class="btn"
         
          @click="changeHot(index)"
          >aaa</el-button
        >
      </div>
    </div>
    <!-- 对应分类的歌单详细 -->
    <div class="typeResult">
      <ul class="lists">
        <li
          class="list"
          
          @click="toPlaylistDetails(h.id)"
        >
          <el-image src="../../../img/login.jpg" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../img/back.jpg" />
            </div>
          </el-image>
          <p class="title">bbb</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        
        background
        :current-page="pagination + 1"
        layout="prev, pager, next"
        :total="pages * 10"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".songList" :bottom="100"></el-backtop>
  
   </div>
</template>

<script setup>
// import {boutique} from '@/api'
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter()
// const info = reactive ({
//    boutique :[] ,

// })

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