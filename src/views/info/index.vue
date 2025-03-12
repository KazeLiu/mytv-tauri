<template>
  <div class="flex flex-col items-center p-10">
    <div class="flex items-center justify-around flex-col gap-10">
      <div class="flex items-center justify-around gap-3">
        <el-avatar
            :src="avatar"
        />
        <div>KazeLiu</div>
      </div>
      <el-button @click="toLink">查看项目，点个Star，一起写代码？🤔</el-button>
    </div>

    <div class="mt-10 text-2xl">免责声明</div>
    <div class="mt-3">
      本程序仅供个人学习和研究使用。程序的开发初衷是为帮助开发者学习 Tauri 2
      框架，并提升个人技术水平。程序并不意图侵犯任何版权或其他合法权益。如果您在使用过程中发现任何版权问题或侵犯了他人合法权益，请立即停止使用，并告知我们，我们将采取适当的措施。
      我们对程序中的内容、服务和第三方资源的合法性、准确性、完整性不作任何保证。用户在使用本程序时应自行承担相关风险，开发者不承担因此产生的任何法律责任。
      本程序不用于商业用途，并且不含任何恶意软件或广告。
    </div>
    <div class="mt-3">
      程序还有很多未完善的地方，包括4k的某些格式无法播放，代码逻辑有漏洞，也没有合格的log记录，如果有问题，希望能给我提issues而不是喷我，谢谢
    </div>
    <el-button class="mt-10" type="warning" @click="router.back()">回首页</el-button>
  </div>
</template>

<script setup>
import {openBrowser} from "@/utils/windowUtils.js";

const avatar = new URL('@/assets/avatar.jpg', import.meta.url);
import {useRoute, useRouter} from "vue-router";


const router = useRouter();
const toLink = () => {
  openBrowser('https://github.com/KazeLiu/mytv-tauri')
}
</script>

<style scoped>

</style>