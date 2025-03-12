# 悦视

## 项目简介

<div style="width: 100%;text-align: center">
<img height="100" src="readImage%2Flogo.png" width="100"/>
</div>

### 希望有人能和我一起开发

一个基于 Tauri 2 和 Vue 3 开发的现代化电视流媒体播放器应用。支持通过 M3U 地址和 EPG 地址自动解析和播放直播流。

## 截图

![QQ20241206-171020.png](readImage%2FQQ20241206-171020.png)
![QQ20241206-171005.png](readImage%2FQQ20241206-171005.png)
![QQ20241206-171123.png](readImage%2FQQ20241206-171123.png)
![QQ20241206-171129.png](readImage%2FQQ20241206-171129.png)
![QQ20241206-171200.png](readImage%2FQQ20241206-171200.png)

## 使用方法 （请重点阅读）

去[releases](https://github.com/KazeLiu/mytv-tauri/releases)下载

然后放到某个文件夹内，双击打开即可。
注意：该程序会在程序文件夹下新建两个文件夹和一个设置文件，分别为存放m3u和epg的文件夹。然后一个setting.json。
所以不要放在桌面跑。

打开后可以看到频道列表，可以点击网页频道或订阅频道。

网页频道是固定的，它是通过解析电视台的官方页面播放，属于稳定的播放源，如果有建议添加的电视台，可以向我提issues。

你可以在设置里面添加新的订阅源和节目单源或者单个频道，但是不保证能解析成功或者能将节目单对应上。

## 警告

程序是 alpha 版本，可能存在一些问题，请按流程使用，不要尝试其他的动作（例如卡住了就F5刷新，暂时还没有屏蔽这种按钮）。

## 预想功能

- [x] 能添加单个频道
- [x] 频道能分组
- [ ] 使用DynamicScroller解决列表卡顿（请求支援）
- [x] 能同时播放多个频道
- [x] 能全屏播放，且在全屏播放下有界面
- [x] 访问网站来播放
- [ ] 添加源的有效性检测（通过ping源的ip地址）
- [x] 源融合
- [ ] 录制节目
- [ ] 屏幕截图&翻译
- [ ] 读取音频流添加字幕&翻译（请求支援）
- [ ] 界面更好看（请求支援）
- [ ] IPv6和IPv4的判定（请求支援）

## 未来贡献者

我们预留了特别的感谢位置，期待未来更多优秀的贡献者加入！

## 特别感谢

在前期不熟练的开发中，碰到的坑，感谢他们帮我解决

- [目棃](https://github.com/BTMuli)
- [Goodjooy](https://github.com/Goodjooy)

## 致谢

### 默认订阅源

- [台标库](https://github.com/fanmingming/live/)
- [IPv6订阅源](https://github.com/fanmingming/live/)
- [节目单订阅源](http://epg.51zmt.top:8000/)

### 工具类

- [Tauri](https://tauri.app/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)
- [hls.js](https://github.com/video-dev/hls.js)
- [m3u8-parser](https://github.com/videojs/m3u8-parser)
- [epg-parser](https://github.com/freearhey/epg-parser)
- [RustRover](https://www.jetbrains.com/rust/)
- [Github代理加速](https://ghp.ci/)

## 项目灵感

- [mytv-android](https://github.com/yaoxieyoulei/mytv-android)

## 免责声明

本程序仅供个人学习和研究使用。程序的开发初衷是为帮助开发者学习 Tauri 2
框架，并提升个人技术水平。程序并不意图侵犯任何版权或其他合法权益。如果您在使用过程中发现任何版权问题或侵犯了他人合法权益，请立即停止使用，并告知我们，我们将采取适当的措施。

我们对程序中的内容、服务和第三方资源的合法性、准确性、完整性不作任何保证。用户在使用本程序时应自行承担相关风险，开发者不承担因此产生的任何法律责任。

本程序不用于商业用途，并且不含任何恶意软件或广告。

## 许可证

MIT

## 贡献

欢迎通过 Issue 和 Pull Request 参与贡献！

*项目持续建设中，感谢每一位开源贡献者！*