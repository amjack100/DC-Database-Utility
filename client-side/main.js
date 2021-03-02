const { app, BrowserWindow } = require("electron");

const path = require("path");
// require("electron-reload")(__dirname, {
//   electron: require(`${__dirname}/node_modules/electron`),
// });
const fs = require("fs");

// dc-domain 10.92.2.15
// console.log(process.argv[2]);

let rawdata = fs.readFileSync(path.join(__dirname, "bookmarks.json"));
let bookmarks = JSON.parse(rawdata);

console.log(bookmarks);

var connectedHost = "http://localhost:5000/";

const config = {
  urlToLoad: connectedHost,
};

function createWindows() {
  appWindow = new BrowserWindow({
    x: 15,
    y: 15,
    width: 600,
    height: 800,
    frame: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  var contents = appWindow.webContents;
  contents.session.clearCache();
  appWindow.setOpacity;
  appWindow.loadURL(config.urlToLoad);
}

app.on("ready", createWindows);
app.on("window-all-closed", () => {
  app.quit();
});
