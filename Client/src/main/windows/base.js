import EventEmitter from 'events'
import { isLinux } from '../config'

/**
 * A Mark Text window.
 * @typedef {BaseWindow} IApplicationWindow
 * @property {number | null} 标识符 id  (= browserWindow.id)或在初始化期间为null.
 * @property {Electron.BrowserWindow} browserWindow The browse window.
 * @property {WindowLifecycle} lifecycle The window lifecycle state.
 * @property {WindowType} type The window type.
 */

// Window type
export const WindowType = {
    BASE: 'base', // You shold never create a `BASE` window.
    EDITOR: 'editor',
    SETTINGS: 'settings'
}


export const WindowLifecycle = {
    NONE: 0,
    LOADING: 1,
    READY: 2,
    QUITTED: 3
}
class BaseWindow extends EventEmitter {
    /**
      * @param {Accessor} accessor 应用程序实例的应用程序访问器。
     */
    constructor(accessor) {
        super()

        this._accessor = accessor
        this.id = null
        this.browserWindow = null
        this.lifecycle = WindowLifecycle.NONE
        this.type = WindowType.BASE
    }
    bringToFront() {
        const { browserWindow: win } = this
        if (win.isMinimized()) win.restore()
        if (!win.isVisible()) win.show()
        if (isLinux) {
            win.focus()
        } else {
            win.moveTop()
        }
    }
    reload() {
        this.browserWindow.reload()
    }

    destroy() {
        this.lifecycle = WindowLifecycle.QUITTED
        this.emit('window-closed')

        this.removeAllListeners()
        if (this.browserWindow) {
            this.browserWindow.destroy()
            this.browserWindow = null
        }
        this.id = null
    }
    // --- private ---------------------------------

    _buildUrlWithSettings(windowId, env, userPreference) {
        //注意:只发送绝对必要的值。完整的设置是延迟加载。
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
            ? 'http://localhost:9091'
            : `file://${__dirname}/index.html`

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
        //硬编码主题背景颜色，直接显示窗口的fastet窗口准备时间。
        //稍后自定义主题，我们需要的背景颜色(例如从元信息)和等待
        //该窗口被加载，然后将主题数据传递给渲染器。
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