var electron;

if (electron === undefined) {
    electron = require("electron");
}

let Storage = {
    set(key, value) {
        electron.ipcRenderer.send("setStore", key, value);
    },

    get(key) {
        return electron.ipcRenderer.sendSync("getStore", key)
    },

    remove(name) {
        electron.ipcRenderer.send("delStore", key);
    }
}
