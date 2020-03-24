const ipcRenderer = require('electron').ipcRenderer;
window.onload = () => {
    var btn_close = this.document.querySelector('#close');
    var btn_max = this.document.querySelector('#max');
    var btn_min = this.document.querySelector('#min');
    var btn_muen = this.document.querySelector('#muen');

    btn_close.onclick = () => {
        ipcRenderer.send('mainClose');
    }
    btn_max.onclick = () => {
        ipcRenderer.send('mainMax');
    }
    btn_min.onclick = () => {
        ipcRenderer.send('mainMin');
    }
    btn_muen.onclick = () => {
        ipcRenderer.send('mainMuen');
    }
}