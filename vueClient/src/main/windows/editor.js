import path from 'path'
import { BrowserWindow, dialog, ipcMain } from 'electron'
import windowStateKeeper from 'electron-window-state' //保存窗口状态

import BaseWindow, { WindowLifecycle, WindowType } from './base'
import { TITLE_BAR_HEIGHT, editorWinOptions, isLinux, isOsx } from '../config'

import { ensureWindowPosition } from './utils'


class EditorWindow extends BaseWindow {
    constructor(accessor) {
        super(accessor)
        this.type = WindowType.EDITOR

        this._directoryToOpen = null
        this._filesToOpen = []
        this._markdownToOpen = []

        this._openedRootDirectory = ''
        this._openedFiles = []
    }
    createWindow(rootDirectory = null, fileList = [], markdownList = [], options = {}) {
        const { menu: appMenu, env, preferences } = this._accessor
        //是否增加标签页
        const addBlankTab = !rootDirectory && fileList.length === 0 && markdownList.length === 0

        const mainWindowState = windowStateKeeper({
            defaultWidth: 1200,
            defaultHeight: 800
        })
        const { x, y, width, height } = ensureWindowPosition(mainWindowState)
        //Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
        const winOptions = Object.assign({ x, y, width, height }, editorWinOptions, options)
        if (isLinux) {
            winOptions.icon = path.join(__static, 'logo-96px.png')
        }

        const {
            titleBarStyle,
            theme,
            sideBarVisibility,
            tabBarVisibility,
            sourceCodeModeEnabled
        } = preferences.getAll()
        if (!isOsx) {
            winOptions.titleBarStyle = 'default'
            if (titleBarStyle === 'native') {
                winOptions.frame = true
            }
        }

        winOptions.backgroundColor = this._getPreferredBackgroundColor(theme)

        let win = this.browserWindow = new BrowserWindow(winOptions)
        this.id = win.id
        appMenu.addEditorMenu(win, { sourceCodeModeEnabled })

        //Event: 'did-finish-load' 当导航完成时发出事件，onload 事件也完成.
        win.webContents.once('did-finish-load', () => {
            this.lifecycle = WindowLifecycle.READY
            this.emit('window-ready')
            //恢复和聚焦窗口
            this.bringToFront()
            const lineEnding = preferences.getPreferedEol()
            appMenu.updateLineEndingMenu(this.id, lineEnding)

            win.webContents.send('mt::bootstrap-editor', {
                addBlankTab,
                markdownList: this._markdownToOpen,
                lineEnding,
                sideBarVisibility,
                tabBarVisibility,
                sourceCodeModeEnabled
            })

            this._doOpenFilesToOpen()
            this._markdownToOpen.length = 0

        })
    }
}
export default EditorWindow
