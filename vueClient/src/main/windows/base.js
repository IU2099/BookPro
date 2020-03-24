import EventEmitter from 'events'
import { isLinux } from '../config'

//窗口类型
export const WindowType = {
    BASE: 'base',
    EDITOR: 'editor',
    SETTINGS: 'settings'
}
//窗口生命周期
export const WindowLifecycle = {
    NONE: 0,
    LOADING: 1,
    READY: 2,
    QUITTED: 3
}

class BaseWindow extends EventEmitter {
    constructor(accesson) {
        super()
        this._accessor = accessor
        this.id = null
        this.browserWindow = null
        this.type = WindowType.BASE
        this.lifecycle = WindowLifecycle.NONE
    }
    bringToFront() {
        const { browserWindow: win } = this
        if (win.isMinimized()) { //返回 boolean, 窗口是否最小化.
            win.restore() //将最小化的窗口恢复为之前的状态.
        }
        if (!win.isVisible()) { //返回 boolean, 窗口是否可见.
            win.show()  //展示并且使窗口获得焦点.
        }
        if (isLinux) {
            win.focus() //窗口获得焦点.
        } else {
            win.moveTop()
        }
    }
    reload() {
        this.browserWindow.reload() //类似 webContents.reload()重载当前页.
    }
    destroy() {
        this.lifecycle = WindowLifecycle.QUITTED
        // emit(event, [arg1], [arg2], [...])
        // 按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false。
        this.emit('window-closed')
        // removeAllListeners([event])
        // 移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。
        this.removeAllListeners()
        if (this.browserWindow) {
            this.browserWindow.destroy()
            this.browserWindow = null
        }
        this.id = null
    }

    // --- private ---------------------------------

    _buildUrlWithSettings(windowId, env, userPreference) {
        // NOTE: Only send absolutely necessary values. Full settings are delay loaded.
        const { type } = this
        const { debug, paths } = env
        const {
            codeFontFamily,
            codeFontSize,
            hideScrollbar,
            theme,
            titleBarStyle
        } = userPreference.getAll()

        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:9090'
            : `file://${__dirname}/index.html`

        //设置一个搜索参数的新值，假如原来有多个值将删除其他所有的值。
        const url = new URL(baseUrl)
        url.searchParams.set('udp', paths.userDataPath)
        url.searchParams.set('debug', debug ? '1' : '0')
        url.searchParams.set('wid', windowId)
        url.searchParams.set('type', type)

        // Settings
        url.searchParams.set('cff', codeFontFamily)
        url.searchParams.set('cfs', codeFontSize)
        url.searchParams.set('hsb', hideScrollbar ? '1' : '0')
        url.searchParams.set('theme', theme)
        url.searchParams.set('tbs', titleBarStyle)

        return url
    }

    _buildUrlString(windowId, env, userPreference) {
        return this._buildUrlWithSettings(windowId, env, userPreference).toString()
    }
    _getPreferredBackgroundColor(theme) {
        switch (theme) {
            case 'dark':
                return '#282828'
            case 'material-dark':
                return '#34393f'
            case 'ulysses':
                return '#f3f3f3'
            case 'graphite':
                return '#f7f7f7'
            case 'one-dark':
                return '#282c34'
            case 'light':
            default:
                return '#ffffff'
        }
    }
}
export default BaseWindow
