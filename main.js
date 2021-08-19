const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')

var tray = null

function createWindow () {
  /* 创建项目窗口 */
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js')
    }
  })

  /* 指向html页面进行渲染 */
  mainWindow.loadFile('./src/index.html')
  /* 修改应用菜单 
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu) */
  /* 创建系统托盘 */
  tray = new Tray('./pubilc/e6.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示', role: 'show', click: () => {
        mainWindow.show()
      }
    },
    {
      label: '隐藏', role: 'hide', click: () => {
        mainWindow.hide()
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
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})