// file: start.js

 // Electronのライブラリを読み込む --- (*1)
 const electron = require('electron')
 const app = electron.app
 const BrowserWindow = electron.BrowserWindow

 // 起動設定 --- (*2)
 const mainFile = 'file://' + __dirname + '/index.html'
 const winSize = {width: 600, height: 400, webPreferences: {nodeIntegration: true}}

 // Electronの各種イベントを処理する --- (*3)
 let win = null // メインウィンドウ
 // Electronの起動準備が整った時 --- (*4)
 app.on('ready', () => {
   // メインウィンドウを作成してメインファイルを読み込む
   win = new BrowserWindow(winSize)
   win.loadURL(mainFile)
   win.on('closed', () => { win = null; })
 })
 // 閉じるボタンの処理 --- (*5)
 app.on('window-all-closed', () => {
   if (process.platform != 'darwin') app.quit()
 })