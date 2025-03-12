import {defineStore} from "pinia";
import {BaseDirectory, exists, readFile, readDir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {Parser} from 'm3u8-parser';
import useSettingStore from "@/store/modules/setting.js";
import {ElMessage, ElNotification} from "element-plus";
import {downloadFile} from "@/utils/fileUtils.js";


const useM3uStore = defineStore('m3u', {
    state: () => ({
        m3uList: [],
    }),
    actions: {
        /**
         * 检查资源目录下是否存在m3u文件夹
         * 遍历所有m3u文件并解析内容
         * 合并解析结果到m3uList状态
         */
        async getM3uList() {
            let existsFile = await exists('m3u/', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let fileList = await readDir('m3u/', {baseDir: BaseDirectory.Resource});
                fileList = fileList.filter(x => x.isFile)
                let m3uList = [];
                for (let i = 0; i < fileList.length; i++) {
                    let m3uFileText = await readTextFile(`m3u/${fileList[i].name}`, {baseDir: BaseDirectory.Resource})
                    m3uList.push(...this.parseM3U8Text(m3uFileText, fileList[i].name));
                }
                this.m3uList = m3uList;
            }
        },
        /**
         * 使用m3u8-parser解析文本
         * 标准化tvg-id格式（处理特殊字符）
         * 提取频道元数据（名称、logo、分组等）
         * 返回结构化频道列表
         */
        parseM3U8Text(m3u8Text, source) {
            const parser = new Parser();
            let tvList = [];
            source = source.replace(/\.[^.]+$/, '');
            parser.push(m3u8Text);
            parser.end();

            function normalizeTvgId(tvgId) {
                if (!tvgId) return null;
                return tvgId
                    .replace(/\+/g, 'Plus') // 处理 + 号
                    .replace(/[&]/g, 'And') // 处理 & 符号
                    .replace(/[-]/g, '_')   // 删除 - 符号
                    .replace(/[\s]/g, '')   // 删除空格
                    .replace(/[.]/g, '')
            }

            function parseM3ULine(line) {
                const name = line.split(',').at(-1);
                const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
                const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
                const groupTitleMatch = line.match(/group-title="([^"]+)"/);

                return {
                    name,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : name, //  唯一id 可以重复
                    tvgName: tvgNameMatch ? tvgNameMatch[1] : null,
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : null,
                    groupTitle: groupTitleMatch ? groupTitleMatch[1] : null,
                    labelId: `${normalizeTvgId(name)}_${normalizeTvgId(source)}`, // 这个是给打开窗口时使用的id
                };

            }

            parser.manifest.segments.forEach(x => {
                let result = parseM3ULine(x.title);
                let find = tvList.find(y => y.tvgId.toLowerCase() === result.tvgId.toLowerCase());
                let name;
                if (x.uri.includes('$')) {
                    name = x.uri.split('$').at(-1)
                }
                if (find) {
                    find.urlList.push({
                        source,
                        url: x.uri,
                        name: `线路${find.urlList.length + 1}${name ? `: ${name}` : ''}`
                    })
                } else {
                    tvList.push({
                        ...result,
                        urlList: [{
                            source,
                            url: x.uri,
                            name: `线路1${name ? `: ${name}` : ''}`
                        }]
                    })
                }
            })
            return tvList;
        },
        async downloadM3uList() {
            let settingStore = useSettingStore();
            const downloadPromises = settingStore.m3uUrlList.map(async (item) => {
                await downloadFile(item.url, 'm3u', `${item.name}.m3u`);
            });
            await Promise.all(downloadPromises);
            await this.getM3uList();
            await settingStore.setSetting({lastDownloadM3uTime: new Date()});
        },
        async addCustomM3uItem(data) {
            let settingStore = useSettingStore();
            settingStore.customM3uList.push(data);
            await settingStore.setSetting({customM3uList: settingStore.customM3uList});
        },
        async removeCustomM3uItem(kazeId) {
            let settingStore = useSettingStore();
            settingStore.customM3uList = settingStore.customM3uList.filter(x => x.kazeId !== kazeId)
            await settingStore.setSetting({customM3uList: settingStore.customM3uList});
        },
        async getCustomM3uList() {
            let settingStore = useSettingStore();
            return settingStore.customM3uList ?? [];
        },
    },
})

export default useM3uStore;