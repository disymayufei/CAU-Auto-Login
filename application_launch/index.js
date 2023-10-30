require("./storage");

const { app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const image = require("./image");
const childProcess = require("child_process");

const win_cache_by_name = {}; // 建立窗口名与窗口实例的映射关系
const win_cache_by_id = {}; // 建立窗口ID与窗口实例的映射关系

let visible_area;
let tray = null;  // 用来存放系统托盘

function createWindow(name) {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 1024,
        minHeight: 768,
        frame: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        icon: "./resource/img/favicon.png"
    }); // 创建浏览器窗口

    mainWindow.loadFile('./resource/index.html');

    win_cache_by_name[name] = mainWindow;
    win_cache_by_id[mainWindow.webContents.id] = mainWindow;

    tray = new Tray(image.iconImage);

    let menu = [
        {
            label: '显示主窗口',
            id: 'show-window',
            enabled: !mainWindow.show,
            click() {
                mainWindow.show();
            }
        },
        {
            label: '退出',
            click() {
                mainWindow.show();
                mainWindow.webContents.send("close-app");
            }
        }
    ];

    // 构建菜单
    let builtMenu = Menu.buildFromTemplate(menu);
    // 给系统托盘设置菜单
    tray.setContextMenu(builtMenu);
    // 给托盘图标设置气球提示
    tray.setToolTip("CAU 校网自动登录器");

    // 托盘图标被点击
    tray.on('click', () => {
        // 显示窗口
        mainWindow.show();
    });

    // 窗口隐藏
    mainWindow.on('hide', () => {
        // 启用菜单的显示主窗口项
        builtMenu.getMenuItemById("show-window").enabled = true;
        // 重新设置系统托盘菜单
        tray.setContextMenu(builtMenu);
    });

    // 窗口显示
    mainWindow.on('show', () => {
        // 禁用显示主窗口项
        builtMenu.getMenuItemById("show-window").enabled = false;
        // 重新设置系统托盘菜单
        tray.setContextMenu(builtMenu);
    });
}

// 应用程序准备就绪时触发
app.whenReady().then(() => {
    createWindow("main") // 创建窗口

    let screen = require("electron").screen;
    visible_area = [screen.getPrimaryDisplay().workAreaSize.width, screen.getPrimaryDisplay().workAreaSize.height];

    // macOS 上需要的特殊处理，以正确打开窗口
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

// 实现开机自启
const ex = process.execPath;

ipcMain.handle("set-launch-with-windows", (event, args) => {
    // 仅限打包后注入开机启动项
    if (args.launch_with_windows){
        childProcess.exec(`REG ADD HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run /v electron.app.BigFoot-WOW /t REG_SZ /d "${ex}" /f`,function(err){
            console.log(err);
        });
    }
    else {
        childProcess.exec("REG DELETE HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run /v electron.app.BigFoot-WOW /f",function(err){
            console.log(err);
        });
    }
});



// 所有窗口关闭时触发
app.on('window-all-closed', function () {
    // 除 macOS（darwin）外，关闭所有窗口时通常意味着退出应用程序
    if (process.platform !== 'darwin') app.quit()
});

/* 关闭，最小化与最大化的处理逻辑 */
ipcMain.on("close-app", function (event) {
    const sel_win = win_cache_by_id[event.sender.id];
    sel_win.close();
});
ipcMain.on("min-app", function (event) {
    const sel_win = win_cache_by_id[event.sender.id];
    sel_win.hide();
});
ipcMain.on("max-app", function (event) {
    const sel_win = win_cache_by_id[event.sender.id];
    if (sel_win.isMaximized()) {
        sel_win.unmaximize();
    }
    else {
        sel_win.maximize();
    }
});
