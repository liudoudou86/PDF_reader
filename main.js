const { app, BrowserWindow, dialog, Menu, Tray, globalShortcut } = require('electron')
const path = require('path')
const PDFWindow = require('electron-pdf-window')

let tray = null

app.whenReady().then(() => {

  /* 创建项目窗口 */
  const translationWindow = new BrowserWindow({
    frame: false,
    icon : "./image/256x256.ico",
  })

  /* 自动隐藏 */
  translationWindow.hide()

  /* 添加链接网址 */
  translationWindow.loadURL('https://fanyi.qq.com/')

  /* 创建系统托盘 */
  tray = new Tray(path.join(__dirname, './image/e6.ico')) // 此写法为全局变量方便打包后使用
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '重启',
        click() {
          app.relaunch();
          app.quit();
        }
    },
    {
      label: '退出', 
      role: 'quit', 
        click: () => {
          app.quit()
        }
    } 
  ])
  tray.setToolTip(app.name)
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  /* 创建快捷键 */
  globalShortcut.register('Alt+z', () => {

    searchWindow.show()

  })

  /* 创建快捷键 */
  globalShortcut.register('Control+Space', () => {

    /* 创建项目窗口 */
    const pdfWindow = new BrowserWindow({
      icon : "./image/256x256.ico",
      autoHideMenuBar : true
    })

    pdfWindow.show()
    pdfWindow.maximize()

    /* 创建浏览文件夹 */
    dialog.showOpenDialog(pdfWindow, {
        properties: ['openFile'],
        filters: [
            { name : 'All Files', extensions : ['*'] }
        ]
    }).then(result => {
        if (result.canceled) {
            console.log('User manually canceled')
        } else {
            const filepath = result.filePaths[0]
            pdfWindow.loadURL(`file://${filepath}`) //该位置使用Tab键上面的符号
            PDFWindow.addSupport(pdfWindow)
        }
    }).catch(err => {
        console.log(err)
    })
  })

  globalShortcut.register('Control+z', () => {

    translationWindow.show()
    translationWindow.maximize()

  })

  globalShortcut.register('Esc', () => {

    translationWindow.hide()

  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})