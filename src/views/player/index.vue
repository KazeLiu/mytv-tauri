<template>
  <div class="play">
    <div class="video-area relative"
         @dblclick.stop="controls.fullScreen"
         @mouseenter="controls.startHoverState"
         @mousemove="controls.resetTimer"
         @mouseleave="controls.stopHoverState">
      <video-player v-if="video.activeStream.url"
                    ref="videoPlayerRef"
                    v-model="video.activeStream.url"
                    @update:isPlay="controls.handlePlayChange"
                    @update:playInfo="controls.changePlayInfo"
      ></video-player>
      <div class="video-area-controls absolute top-0 bottom-0 left-0 right-0"
           :class="{ 'hide': !controls.isHovering }"
           v-if="video.checkItem.name">
        <div class="controls-top height-[85px] top-0 absolute p-3 flex flex-nowrap justify-between items-center gap-3">
          <div class="flex items-center gap-3">
            <el-image :crossorigin="null"
                      v-if="video.checkItem.tvgLogo"
                      :src="video.checkItem.tvgLogo"
                      class="tv-tag-image p-1 h-[60px] max-w-[90px]"
                      fit="contain">
              <template #error>
                <div></div>
              </template>
            </el-image>
            <div class="epg w-full min-w-[600px] overflow-auto" v-if="controls.epgList?.length>0">
              <timeline ref="timelineRef" :epg="controls.epgList"/>
            </div>
          </div>
          <div class="time text-white flex flex-col justify-center items-center tabular-nums">
            <div class="text-sm flex gap-1"><span>{{ getNowTime.date }}</span> <span>{{ getNowTime.week }}</span></div>
            <div class="text-3xl w-full text-left">{{ getNowTime.time }}</div>
          </div>
        </div>
        <div
            class="controls-bottom text-white absolute bottom-0 height-[300px] p-3 flex flex-nowrap justify-between items-center">
          <div class="flex flex-col items-start">
            <div class="text-xl truncate max-w-[300px] select-none" :title="video.checkItem.name">
              {{ video.checkItem.name }}
            </div>
            <div class="flex gap-2">
              <div class="ip-type text-xs 	px-1 py-0.5 rounded-md ">{{
                  determineIPType(video.activeStream.url)
                }}
              </div>
              <el-select v-model="video.activeStreamName"
                         @change="video.changeStream"
                         style="width:200px"
                         size="small"
              >
                <el-option
                    v-for="item in video.checkItem.urlList"
                    :key="item.url"
                    :label="item.name"
                    :value="item.url"
                >
                  <div class="flex justify-between">
                    <span style="float: left">{{ item.name }}</span>
                    <!--                    <span class="ml-5">9999ms</span>-->
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="controls-bottom-button flex flex-1 justify-center flex-nowrap gap-5 text-2xl">
            <div @click.stop="controls.playPause" title="播放暂停">
              <i class="fa-solid fa-play" v-show="!controls.isPlay"></i><i
                class="fa-solid fa-pause" v-show="controls.isPlay"></i></div>
            <!--            <div @click.stop="controls.stop" title="停止"><i class="fa-solid fa-stop"></i></div>-->
            <div @click.stop="controls.refresh" title="刷新"><i class="fa-solid fa-rotate"></i></div>
            <div @click.stop="controls.fullScreen" title="全屏"><i class="fa-solid fa-expand"></i></div>
            <div title="音量" class="flex items-center justify-between w-[140px]">
              <i class="fa-solid fa-volume-xmark" v-show="controls.volumeValue == 0"></i>
              <i class="fa-solid fa-volume-low" v-show="controls.volumeValue>=1 && controls.volumeValue<60"></i>
              <i class="fa-solid fa-volume-high" v-show="controls.volumeValue >=60"></i>
              <div class="w-[100px]">
                <el-slider size="small" @change="controls.changeVolume" v-model="controls.volumeValue"/>
              </div>
            </div>
          </div>
          <div class="info flex flex-col items-end justify-end cursor-default select-none tabular-nums">
            <div class="text-xs">流分辨率：{{ controls.playInfo.videoSize }}</div>
            <div class="text-xs">参考网速： {{ controls.playInfo.networkSpeed }}</div>
            <div class="text-xs">播放/已缓冲：{{ formatSeconds(controls.playInfo.playerTime) }}/{{
                formatSeconds(controls.playInfo.bufferInfo - controls.playInfo.playerTime)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive, ref, watch} from 'vue';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {formatSeconds, formatTimeByFormat, getWeekDay} from "@/utils/timeUtils.js";
import {determineIPType} from "@/utils/networkUtils.js";
import {load} from "@tauri-apps/plugin-store";
import {useRoute} from "vue-router";
import Timeline from "@/views/player/timeline.vue";
import VideoPlayer from "@/views/player/videoPlayer.vue";
import {markProgramStatus} from "@/utils/epgUtils.js";
import useEPGStore from "@/store/modules/epg.js";
import useSettingStore from "@/store/modules/setting.js";

const epgStore = useEPGStore()
const {proxy} = getCurrentInstance();

const controls = reactive({
  hoverTimer: null,
  isHovering: false,
  epgList: computed(() => markProgramStatus(epgStore.findPrograms(video.checkItem?.tvgId) || [])),
  playInfo: {},
  changePlayInfo(info) {
    controls.playInfo = info;
  },
  startHoverState() {
    controls.isHovering = true
    controls.resetTimer()
  },
  resetTimer() {
    controls.isHovering = true
    clearTimeout(controls.hoverTimer)
    controls.hoverTimer = setTimeout(() => {
      controls.isHovering = false
    }, 10000) // 10秒后自动隐藏
  },
  stopHoverState() {
    clearTimeout(controls.hoverTimer)
    controls.isHovering = false;
  },
  isPlay: true,
  playPause() {
    proxy.$refs.videoPlayerRef.playPause();
  },
  handlePlayChange(val) {
    controls.isPlay = val
  },
  stop() {
    proxy.$refs.videoPlayerRef.stop();
  },
  refresh() {
    proxy.$refs.videoPlayerRef.refresh();
  },
  isFullScreen: false,
  fullScreen() {
    getCurrentWindow().setFullscreen(!controls.isFullScreen);
    controls.isFullScreen = !controls.isFullScreen;
  },
  volumeValue: 100,
  changeVolume(val) {
    proxy.$refs.videoPlayerRef.setVolume(val);
  }
})
const video = reactive({
  show: true,
  checkItem: {},
  storeActiveStreamList: [],
  activeStreamName: null,
  activeStream: {},
  changeStream() {
    video.activeStream = video.checkItem.urlList.find(item => item.url === video.activeStreamName);
    if (video.storeActiveStreamList?.some(item => item.label == video.checkItem.labelId)) {
      video.storeActiveStreamList.forEach(item => {
        if (item.label == video.checkItem.labelId) {
          item.url = video.activeStreamName
        }
      })
    } else {
      video.storeActiveStreamList.push({
        label: video.checkItem.labelId,
        url: video.activeStreamName
      })
    }
    controls.refresh()
    // 保存喜好到设置内
    useSettingStore().setSetting({activeStreamList: video.storeActiveStreamList})
  },
  async getCheckItem() {
    const store = await load('playInfo.json', {autoSave: false});
    video.checkItem = await store.get(`${getCurrentWindow().label}`);
    video.storeActiveStreamList = useSettingStore().activeStreamList || []
    video.activeStreamName = video.storeActiveStreamList.find(x => x.label == video.checkItem.labelId)?.url || video.checkItem.urlList[0].url;
    video.changeStream();
  }
});

const getNowTime = reactive({
  time: formatTimeByFormat(),
  date: formatTimeByFormat('MM-dd'),
  week: getWeekDay(),
  start() {
    setInterval(() => {
      getNowTime.time = formatTimeByFormat();
      getNowTime.date = formatTimeByFormat('MM-dd');
      getNowTime.week = getWeekDay();
    }, 1000)
  }
})
const route = useRoute();


watch(() => controls.isHovering, () => {
  proxy.$refs.timelineRef && proxy.$refs.timelineRef.scrollToCurrentProgram();
})

onMounted(() => {
  video.getCheckItem();
  getNowTime.start();
});
</script>

<style scoped>


.play {
  .video-area {
    width: 100%;
    height: calc(100vw / 1.777778);
    overflow: hidden;
    background: #8c8c8c;

    video {
      width: 100%;
    }

    &.hide {
      .controls-top {
        top: -85px
      }

      .controls-bottom {
        bottom: -75px
      }
    }

    .video-area-controls {


      .time {
      }

      .controls-top, .controls-bottom {
        transition: all 0.5s;
        width: 100%;
        backdrop-filter: brightness(0.8) blur(30px);

        .ip-type {
          background: #828282;
        }
      }
    }
  }


}
</style>
