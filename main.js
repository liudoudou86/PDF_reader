const { app, BrowserWindow, dialog, Menu, Tray, globalShortcut } = require('electron')
const path = require('path')
const PDFWindow = require('electron-pdf-window')

let tray = null

app.whenReady().then(() => {

  /* 创建项目窗口 */
  const mainWindow = new BrowserWindow({
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js')
    }
  })

  /* 自动隐藏 */
  mainWindow.hide()

  /* 创建系统托盘 */
  tray = new Tray(path.join(__dirname, './image/e6.ico')) // 此写法为全局变量方便打包后使用
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示', role: 'show', click: () => {
        mainWindow.show()
      }
    },
    {
      label: '退出', role: 'quit', click: () => {
        app.quit()
      }
    } 
  ])
  tray.setToolTip(app.name)
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  /* 创建快捷键 */
  globalShortcut.register('Control+Space', () => {

    mainWindow.show()
    mainWindow.maximize()

    /* 创建浏览文件夹 */
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name : 'All Files', extensions : ['*'] }
        ]
    }).then(result => {
        if (result.canceled) {
            console.log('User manually canceled')
        } else {
            const filepath = result.filePaths[0]
            mainWindow.loadURL(`file://${filepath}`) //该位置使用Tab键上面的符号
            PDFWindow.addSupport(mainWindow)
        }
    }).catch(err => {
        console.log(err)
    })
  })

  globalShortcut.register('Esc', () => {

    mainWindow.hide()

  })

  globalShortcut.register('Control+z', () => {

    const win = new BrowserWindow({
      icon : "./image/256x256.ico",
      autoHideMenuBar : true,
    })

    win.maximize()

    win.loadURL('https://fanyi.qq.com/')

  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})