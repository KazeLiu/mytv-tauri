<template>
  <div class="epg-list flex flex-col text-xs p-1" @click.stop="epgReactive.showAllEpg"
       v-if="epgReactive.now || epgReactive.next">
    <div :title="epgReactive.now?.title" class="peg-list-now px-1 py-1 truncate rounded-md p-1">
      正在播放：{{ epgReactive.now?.title || '未解析到节目' }}
    </div>
    <div :title="epgReactive.next?.title" class="peg-list-next px-1 py-1 truncate rounded-md p-1">
      即将播放：{{ epgReactive.next?.title || '未解析到节目' }}
    </div>
    <el-dialog :title="channelInfo.name +' 全部节目'" v-model="epgReactive.isShowAllEpg" align-center destroy-on-close>
      <div class="flex flex-col gap-3 all-epg-dialog">
        <div v-for="item in epgReactive.epgList"
             class="p-3 all-epg-item rounded-md text-white"
             :class="{'now-playing':item.status == 0,'isPlay':item.status == 0,'isPlayed':item.status == -1,'isNextPlay':item.status == 1}">
          <div class="flex items-center justify-between">
            <el-tag type="warning" v-if="item.status == -1">已播放</el-tag>
            <el-tag type="success" v-if="item.status == 0">播放中</el-tag>
            <el-tag v-if="item.status == 1">未开始</el-tag>
            <div>播出时间：{{ formatDate(item.startTime) }}</div>
          </div>
          <div class="mt-2">{{ item.title }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
  <div v-else class="epg-list h-full flex items-center justify-center text-sm">
    没有找到节目单
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive} from 'vue';
import {currentAndNextProgram, markProgramStatus} from '@/utils/epgUtils.js';
import {formatDate} from "@/utils/timeUtils.js";
import useEPGStore from "@/store/modules/epg.js";

const epgStore = useEPGStore()

let props = defineProps(['channelInfo']);

let epgReactive = reactive({
  now: {},
  next: {},
  epgList: computed(() => markProgramStatus(epgStore.findPrograms(props.channelInfo.tvgId) || [])),
  isShowAllEpg: false,
  showAllEpg(e) {
    epgReactive.isShowAllEpg = true;
    nextTick(() => {
      const nowPlayingElement = document.querySelector('.now-playing');
      if (nowPlayingElement) {
        nowPlayingElement.scrollIntoView({behavior: 'smooth'});
      }
    })
  },
  currentAndNextProgram() {
    let currentAndNextProgramList = currentAndNextProgram(epgReactive.epgList);
    epgReactive.now = currentAndNextProgramList.now;
    epgReactive.next = currentAndNextProgramList.next;
  },
});
onMounted(() => {
  epgReactive.currentAndNextProgram();
});
</script>

<style scoped>
.epg-list {
  height: 70px;

  .peg-list-now {
    background: #808080;
  }

  .all-epg-dialog {
    height: 70vh;
    overflow: auto;

    .all-epg-item {
      &.isPlay {
        background: #2ECC71;
      }

      &.isPlayed, &.isNextPlay {
        background: #3498db;
      }
    }
  }
}


</style>