// Module to control application life.
var app = require('app');
// Module to create native browser window.
var BrowserWindow = require('browser-window');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Once app is initialized
app.on('ready', function() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 375,
        height: 300,
    });
    // Load page
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    // Open the devtools
    // mainWindow.openDevTools();
    // Emitted when the window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
    // if (process.platform != 'darwin') {
    //     app.quit();
    // }
});