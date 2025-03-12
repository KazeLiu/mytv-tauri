import {BaseDirectory, writeFile, exists, mkdir, readDir, readTextFile, remove} from "@tauri-apps/plugin-fs";
import {fetch} from "@tauri-apps/plugin-http";

export async function downloadFile(downloadUrl, downloadPath = "download", fileName) {
    try {
        // 定义文件的下载 URL 和保存文件名
        const url = downloadUrl; // 替换为你的文件 URL
        fileName = fileName || (url.split('/').pop()?.split('?')[0]);
        let isExists = await exists(`${downloadPath}/`, {baseDir: BaseDirectory.Resource})
        if (!isExists) {
            await mkdir(downloadPath, {baseDir: BaseDirectory.Resource})
        }
        // 检查同名文件是否存在
        // const fullPath = `${downloadPath}/${fileName}`;
        // const isFileExists = await exists(fullPath, {baseDir: BaseDirectory.Resource});
        // if (isFileExists) {
        //     fileName = `default-file-name-${new Date().getTime()}`;
        // }
        const response = await fetch(url, {method: "GET", connectTimeout: 10000});
        if (response.status === 200) {
            // 将文件数据保存到 BaseDirectory.Resource
            const data = await response.text()
            const encoder = new TextEncoder()
            const filePayload = encoder.encode(data)

            await writeFile(`${downloadPath}/${fileName}`, filePayload, {
                baseDir: BaseDirectory.Resource,
            });
            return {code: 'success', message: `下载成功：${fileName}`}
        } else {
            return {code: 'error', message: `下载失败：状态码 ${response.status}`}
        }
    } catch (error) {
        return {code: 'error', message: `下载文件时出错:, ${JSON.stringify(error)}`}
    }
}

export async function removeFile(downloadPath = "download", fileName) {
    try {
        await remove(`${downloadPath}/${fileName}`, {baseDir: BaseDirectory.Resource});
        return {code: 'success', message: `删除成功：${fileName}`}
    } catch (error) {
        return {code: 'error', message: `删除时出错:, ${JSON.stringify(error)}`}
    }
}
