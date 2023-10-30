const Store = require('electron-store');
const {app, ipcMain} = require("electron");

let option={
    name: "config",
    fileExtension: "json",
    cwd: app.getPath('userData'),
    clearInvalidConfig: true, // 发生 SyntaxError则清空配置,
}

let store = new Store(option);


ipcMain.on('setStore', (event, key, value) => {
    store.set(key, value)
});

ipcMain.on('getStore', (event, key) => {
    event.returnValue = store.get(key);
});

ipcMain.on('delStore', (event, key) => {
    store.delete(key);
})