const { app, BrowserWindow } = require('electron')
const ipcMain = require('electron').ipcMain;
let win = null;


app.on('ready', () => {
    win = new BrowserWindow({
        width: 280,
        height: 400,
        resizable: false, //是否可以改变窗口size
        minimizable: false, //窗口是否可以最小化
        maximizable: false,//窗口是否可以最大化
        backgroundColor: '#EEEEE0',
        useContentSize: true,
        transparent: true,
        titleBarStyle: 'hidden', // 隐藏窗口  mac
        frame: false,   //没有边框
        autoHideMenuBar: true,
        webPreferences: { nodeIntegration: true }
    });
    //win.loadURL('../../index.html');
    win.loadFile('../../index.html')
    win.on('closed', function () {
        win = null;
    });
    //win.setAlwaysOnTop(true);//始终在其他窗口之上
    // 打开开发者工具
    // win.webContents.openDevTools();
})

//登录窗口最小化
ipcMain.on('min', function () {
    win.minimize();
})
//登录窗口最大化
ipcMain.on('max', function () {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.maximize();
    }
})
ipcMain.on('close', function () {
    win.close();
})
ipcMain.on('quit', function () {
    app.quit();
})

class MainUI {
    constructor() {
        this.winMain = null;
    }
    init() {
        this.winMain = new BrowserWindow({
            width: 600,
            height: 800,
            resizable: true, //是否可以改变窗口size
            minimizable: true, //窗口是否可以最小化
            maximizable: true,//窗口是否可以最大化
            backgroundColor: '#F08080',
            minWidth: 400,
            minHeight: 400,
            useContentSize: true,
            transparent: true,
            titleBarStyle: 'hidden', // 隐藏窗口  mac
            frame: false,   //没有边框
            autoHideMenuBar: true,
            webPreferences: { nodeIntegration: true }
        });
        this.winMain.loadFile('../../main.html')
        this.winMain.on('closed', function () {
            this.winMain = null;
        });
        this.winMain.webContents.openDevTools()

    }

}
var mainUI = new MainUI();

ipcMain.on('createMain', function () {
    mainUI.init();
})
ipcMain.on('mainClose', function () {
    mainUI.winMain.close();
    //app.quit();
})
ipcMain.on('mainMax', function () {
    if (mainUI.winMain.isMaximized()) {
        mainUI.winMain.unmaximize();
    } else {
        mainUI.winMain.maximize();
    }
})
ipcMain.on('mainMin', function () {
    mainUI.winMain.minimize();
})
ipcMain.on('mainMuen', function () {

})
