var electron;

if (electron === undefined) {
    electron = require("electron");
}

electron.ipcRenderer.on("close-app", (event) => {
    mainWindows.close();
})

/* 处理窗口关闭，最大化和最小化的逻辑 */
let mainWindows = {
    toMax: function (){
        electron.ipcRenderer.send("max-app");
    },

    toMin(){
        electron.ipcRenderer.send("min-app");
    },

    close(){
        new Modal({
            type: "warning",
            text: "确定要退出吗？",
            button_callback: () => {electron.ipcRenderer.send("close-app")},
            sub_button: "取消"
        }).show();
    }
}