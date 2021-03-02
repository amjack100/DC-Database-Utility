const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const tpcPortUsed = require('tcp-port-used')
const log = require('electron-log')
// dc-domain 10.92.2.15
// console.log(process.argv[2]);

tpcPortUsed.check(5000, '127.0.0.1').then((inUse) => {
  if (inUse == false) {
    var serverPath = path.join(app.getAppPath(), 'dist/application/application.exe').replace('app.asar', 'app.asar.unpacked')

    log.info(serverPath)
    cp.spawn('cmd', ['/s', '/c', `powershell -WindowStyle Hidden ${serverPath}`], {
      shell: false,
      detached: true,
      windowsVerbatimArguments: true,
      windowsHide: true,
      stdio: 'ignore',
    })
  }
})

let rawdata = fs.readFileSync(path.join(__dirname, 'bookmarks.json'))
bookmarks = JSON.parse(rawdata)

function refreshBookmarks() {
  let outData = JSON.stringify(bookmarks)

  fs.writeFile(path.join(__dirname, 'bookmarks.json'), outData, 'utf8', () => {
    let rawdata = fs.readFileSync(path.join(__dirname, 'bookmarks.json'))
    bookmarks = JSON.parse(rawdata)
    appWindow.webContents.send('user-data', bookmarks['bookmarks'])
    console.log(`[BOOKMARKS REFRESHED]`)
    console.log(bookmarks)
  })
}

var connectedHost = 'http://localhost:5000/'

function createWindows() {
  appWindow = new BrowserWindow({
    width: 600,
    height: 800,
    frame: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  var contents = appWindow.webContents
  contents.session.clearCache()
  appWindow.setOpacity

  appWindow.loadURL(connectedHost)

  appWindow.webContents.once('dom-ready', () => {
    refreshBookmarks()
  })

  console.log('[ELECTRON SESSION LOADED]')
}

ipcMain.on('user-data-reply', (event, data) => {
  console.log(`[USERDATA RESPONSE]`)
  console.log(data)
})

ipcMain.on('removeBookmark', (event, userInput) => {
  console.log('[REMOVING BOOKMARK]')
  console.log(userInput)

  bookmarkList = bookmarks['bookmarks']
  let newList = []

  let i = 0
  for (x of bookmarkList) {
    i++

    if (x.name == userInput.name) {
      continue
    } else {
      newList.push(x)
    }
  }

  bookmarks['bookmarks'] = newList
  console.log(`{updated list}`)
  console.log(bookmarks)
  refreshBookmarks()
})

ipcMain.on('setBookmark', (event, userInput) => {
  bookmarks['bookmarks'].push(userInput)

  refreshBookmarks()
})

ipcMain.on('closeInfoWindow', (event, data) => {
  console.log('[OPENING DIR]')
  console.log(data)
  cp.spawn('cmd', ['/s', '/c', `explorer "${data}"`], {
    windowsVerbatimArguments: true,
  })
})

app.on('ready', createWindows)
app.on('window-all-closed', () => {
  app.quit()
})
