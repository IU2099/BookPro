import { app, BrowserWindow, clipboard, dialog, ipcMain, nativeTheme } from 'electron'
import { isLinux, isOsx, isWindows } from '../config'

import { WindowType } from '../windows/base'
import EditorWindow from '../windows/editor'

class App {
    constructor(accessor, args) {
        this._accessor = accessor
        this._args = args || { _: [] }
        this._openFilesCache = []
        this._openFilesTimer = null
        this._windowManager = this._accessor.windowManager

        this._listenForIpcMain()
    }
    //应用程序的入口点.
    init() {
        //启用这些功能以使用“背景过滤”css规则！
        if (isOsx) {
            app.commandLine.appendSwitch('enable-experimental-web-platform-features', 'true')
        }

        app.on('ready', this.ready)
    }


    ready = () => {
        const { _args: args, _openFilesCache } = this
        const { preferences } = this._accessor
        if (args._.length) {
            for (const pathname of args._) {
                //忽略所有未知标志
                if (pathname.startsWith('--')) {
                    continue
                }
                // const info = normalizeMarkdownPath(pathname)
                // if (info) {
                //     _openFilesCache.push(info)
                // }
            }
        }
    }
    //消息事件
    _listenForIpcMain() {

    }
}
export default App
