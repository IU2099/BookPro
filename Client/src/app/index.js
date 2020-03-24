import path from 'path'
import fse from 'fs-extra'
import { exec } from 'child_process'
import log from 'electron-log'
import { app, BrowserWindow, clipboard, dialog, ipcMain, nativeTheme } from 'electron'
import { isChildOfDirectory } from 'common/filesystem/paths'
import { isLinux, isOsx, isWindows } from '../config'
import { normalizeAndResolvePath } from '../filesystem'
import { normalizeMarkdownPath } from '../filesystem/markdown'
import { WindowType } from '../windows/base'
import EditorWindow from '../windows/editor'
import SettingWindow from '../windows/setting'



class App {
    constructor(accessor, args) {
        this._accessor = accessor
        this._args = args || { _: [] }
        this._openFilesCache = []
        this._openFilesTimer = null
        this._windowManager = this._accessor.windowManager

        this._listenForIpcMain()
    }


    _listenForIpcMain() {
        ipcMain.on('app-create-editor-window', () => {
            this._createEditorWindow()
        })

        ipcMain.on('screen-capture', async win => {
            if (isOsx) {
                // Use macOs `screencapture` command line when in macOs system.
                const screenshotFileName = await this.getScreenshotFileName()
                exec('screencapture -i -c', async (err) => {
                    if (err) {
                        log.error(err)
                        return
                    }
                    try {
                        // Write screenshot image into screenshot folder.
                        const image = clipboard.readImage()
                        const bufferImage = image.toPNG()
                        await fse.writeFile(screenshotFileName, bufferImage)
                    } catch (err) {
                        log.error(err)
                    }
                    win.webContents.send('mt::screenshot-captured')
                })
            } else {
                // TODO: Do nothing, maybe we'll add screenCapture later on Linux and Windows.
                // if (this.shortcutCapture) {
                //   this.launchScreenshotWin = win
                //   this.shortcutCapture.shortcutCapture()
                // }
            }
        })

        ipcMain.on('app-create-settings-window', () => {
            this._openSettingsWindow()
        })

        ipcMain.on('app-open-file-by-id', (windowId, filePath) => {
            const openFilesInNewWindow = this._accessor.preferences.getItem('openFilesInNewWindow')
            if (openFilesInNewWindow) {
                this._createEditorWindow(null, [filePath])
            } else {
                const editor = this._windowManager.get(windowId)
                if (editor) {
                    editor.openTab(filePath, {}, true)
                }
            }
        })
        ipcMain.on('app-open-files-by-id', (windowId, fileList) => {
            const openFilesInNewWindow = this._accessor.preferences.getItem('openFilesInNewWindow')
            if (openFilesInNewWindow) {
                this._createEditorWindow(null, fileList)
            } else {
                const editor = this._windowManager.get(windowId)
                if (editor) {
                    editor.openTabsFromPaths(
                        fileList.map(p => normalizeMarkdownPath(p))
                            .filter(i => i && !i.isDir)
                            .map(i => i.path))
                }
            }
        })

        ipcMain.on('app-open-markdown-by-id', (windowId, data) => {
            const openFilesInNewWindow = this._accessor.preferences.getItem('openFilesInNewWindow')
            if (openFilesInNewWindow) {
                this._createEditorWindow(null, [], [data])
            } else {
                const editor = this._windowManager.get(windowId)
                if (editor) {
                    editor.openUntitledTab(true, data)
                }
            }
        })

        ipcMain.on('app-open-directory-by-id', (windowId, pathname, openInSameWindow) => {
            const { openFolderInNewWindow } = this._accessor.preferences.getAll()
            if (openInSameWindow || !openFolderInNewWindow) {
                const editor = this._windowManager.get(windowId)
                if (editor) {
                    editor.openFolder(pathname)
                    return
                }
            }
            this._createEditorWindow(pathname)
        })

        // --- renderer -------------------

        ipcMain.on('mt::app-try-quit', () => {
            app.quit()
        })

        ipcMain.on('mt::open-file-by-window-id', (e, windowId, filePath) => {
            const resolvedPath = normalizeAndResolvePath(filePath)
            const openFilesInNewWindow = this._accessor.preferences.getItem('openFilesInNewWindow')
            if (openFilesInNewWindow) {
                this._createEditorWindow(null, [resolvedPath])
            } else {
                const editor = this._windowManager.get(windowId)
                if (editor) {
                    editor.openTab(resolvedPath, {}, true)
                }
            }
        })

        ipcMain.on('mt::select-default-directory-to-open', async e => {
            const { preferences } = this._accessor
            const { defaultDirectoryToOpen } = preferences.getAll()
            const win = BrowserWindow.fromWebContents(e.sender)

            const { filePaths } = await dialog.showOpenDialog(win, {
                defaultPath: defaultDirectoryToOpen,
                properties: ['openDirectory', 'createDirectory']
            })
            if (filePaths) {
                preferences.setItems({ defaultDirectoryToOpen: filePaths[0] })
            }
        })

        ipcMain.on('mt::open-setting-window', () => {
            this._openSettingsWindow()
        })

        ipcMain.on('mt::make-screenshot', e => {
            const win = BrowserWindow.fromWebContents(e.sender)
            ipcMain.emit('screen-capture', win)
        })

        ipcMain.on('mt::request-keybindings', e => {
            const win = BrowserWindow.fromWebContents(e.sender)
            const { keybindings } = this._accessor
            // Convert map to object
            win.webContents.send('mt::keybindings-response', Object.fromEntries(keybindings.keys))
        })
    }
}
export default App