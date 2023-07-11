<template>
    <div>
        <div class="singer">
    <!-- 选择 -->
    <div class="select">
      <!-- 选择地区 -->
      <div class="area">
        <div class="title">语种：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: l.key === info.areaKey }"
            v-for="(l, index) in staticInfo.area"
            :key="index"
            @click="selectArea(l.key)"
          >
            {{ l.name }}
          </div>
        </div>
      </div>
      <!-- 选择类型 -->
      <div class="type">
        <div class="title">分类：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: t.key === info.typeKey }"
            v-for="(t, index) in staticInfo.type"
            :key="index"
            @click="selectType(t.key)"
          >
            {{ t.name }}
          </div>
        </div>
      </div>
      <!-- 首字母筛选 -->
      <div class="screen">
        <div class="title">筛选：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: info.screenKey === s.key }"
            v-for="(s, index) in staticInfo.screen"
            :key="index"
            @click="selectScreen(s.key)"
          >
            {{ s.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 歌手的结果 -->
    <div class="singers">
      <ul
        class="lists"
        v-infinite-scroll="infiniteLoading"
        :infinite-scroll-disabled="info.disabled"
        :infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
      >
        <li
          class="list"
          v-for="(s, index) in info.singers"
          :key="index"
          @click="toSingerDetails(s.id)"
        >
          <el-image :src="s.picUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../img/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ s.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".singer" :bottom="100"></el-backtop>
  </div>
    </div>
</template>

<script setup>
import {singers} from '../../../api'
import { reactive , computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const info = reactive({
    areaKey: -1,
      typeKey: -1,
      screenKey: -1,
      time: 1,
      isMore: false,
      singers: [],
      disabled: false,
})
const staticInfo = {
    area:[
    {
          name: '全部',
          key: -1,
        },
        {
          name: '华语',
          key: 7,
        },
        {
          name: '欧美',
          key: 96,
        },
        {
          name: '日本',
          key: 8,
        },
        {
          name: '韩国',
          key: 16,
        },
        {
          name: '其他',
          key: 0,
        },
    ],
    type: [
        {
          name: '全部',
          key: -1,
        },
        {
          name: '男歌手',
          key: 1,
        },
        {
          name: '女歌手',
          key: 2,
        },
        {
          name: '乐队',
          key: 3,
        },
      ],

      screen: [
        { key: -1, name: '热门' },
        { key: 'a', name: 'A' },
        { key: 'b', name: 'B' },
        { key: 'c', name: 'C' },
        { key: 'd', name: 'D' },
        { key: 'e', name: 'E' },
        { key: 'f', name: 'F' },
        { key: 'g', name: 'G' },
        { key: 'h', name: 'H' },
        { key: 'i', name: 'I' },
        { key: 'j', name: 'J' },
        { key: 'k', name: 'K' },
        { key: 'l', name: 'L' },
        { key: 'm', name: 'M' },
        { key: 'n', name: 'N' },
        { key: 'o', name: 'O' },
        { key: 'p', name: 'P' },
        { key: 'q', name: 'Q' },
        { key: 'r', name: 'R' },
        { key: 's', name: 'S' },
        { key: 't', name: 'T' },
        { key: 'u', name: 'U' },
        { key: 'v', name: 'V' },
        { key: 'w', name: 'W' },
        { key: 'x', name: 'X' },
        { key: 'y', name: 'Y' },
        { key: 'z', name: 'Z' },
        { key: 0, name: '#' },
      ],
}

const time = computed ({
    get () {
        return info.time
    },
    set (val) {
       return val
    }
})
const getSingers = async () => {
    let res = await singers(
        info.areaKey,
        info.typeKey,
        info.screenKey,
        (info.time - 1) * 30
    )
    info.singers.push(...res.data.artists)
    info.isMore = res.data.more
    info.disabled = false
}

const selectArea = (sign) => {
    info.areaKey = sign
    info.time = 1
    info.singers = []
    getSingers()
}
const infiniteLoading = () => {
    info.disabled = true
    if(info.isMore){
        info.time += 1
    }else {
        if(info.time !== 1 ){
            ElMessage({
                message:'暂无更多数据',
                type:'warning'
            })
        }
    }
}
const selectScreen = (sign) => {
    info.screenKey = sign
    info.time = 1
    info.singers = []
    getSingers()
}
const selectType = (sign ) => {
    info.screenKey = sign
    info.time = 1
    info.singers = []
    getSingers()
}

const toSingerDetails = (id) => {
  router.push({
    name:'findSingerel',
    params: { id }
  })
}
getSingers()
</script>

<style lang="scss" scoped>
.select {
  max-width: 1250px;
  min-width: 992px;
  margin: auto;
  display: flex;
  flex-direction: column;
  color: #666;
  .area,
  .type,
  .screen {
    display: flex;
    margin-bottom: 5px;
    .title {
      width: 50px;
      line-height: 45px;
      font-size: 15px;
    }
    .options {
      width: calc(100% - 50px);
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      .option {
        width: 50px;
        height: 17.5px;
        padding: 7.5px 12.5px;
        margin: 4px 0;
        border-radius: 20px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.selected {
  color: #ec4141;
  background-color: #fdf5f5;
}
.singers {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
  .lists {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    cursor: pointer;
    .list {
      height: 290px;
      box-sizing: border-box;
      flex: 1;
      margin: 0;
      p {
        width: 225px;
        height: 30px;
        font-size: 15px;
        white-space: normal;
        text-align: left;
      }
    }
  }
}
</style>