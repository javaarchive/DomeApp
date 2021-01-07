"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, session } = require("electron");
/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const config = require("./config");
const menu = require("./menu");
const utils = require("electron-util");
const Store = require("electron-store");
const https = require("https");
const fs = require("fs");

const settings = new Store({
	defaults: require("./static/prefdefaults.json"),
});


unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("io.github.the-ascent");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected

let mainWindow;
function downloadFile(url) {
	return new Promise(function (resolve, reject) {
		let timeout = setTimeout(reject, settings.get("adblockTimeout"));
		https.get(url, function (error, res, body) {
			if (!error && res.statusCode == 200) {
				clearTimeout(timeout);
				resolve(body);
			} else {
				clearTimeout(timeout);
				reject(error);
			}
		});
	});
}
var filters, blocker;
const createMainWindow = async () => {
	// Init AdBlocker System
	//console.log(settings.get("adblock"));
	if (settings.get("adblock")) {
		if(!filters){
			if (!fs.existsSync(settings.get("adblock-file"))) {
				let outstream = fs.createWriteStream(settings.get("adblock-file"));

				try {
					let resp = await downloadFile(settings.get("adblock-download-list"));
					resp.pipe(outstream);
					resp.on("finish", function () {
						outstream.close();
					});
				} catch (ex) {
					console.warn("AdBlocker File Failed to Download", ex);
				}
			}
			let filters = fs.readFileSync(settings.get("adblock-file"), { encoding: "utf-8" })
			const { ElectronBlocker } = require('@cliqz/adblocker-electron');
			blocker = ElectronBlocker.parse(filters);
			blocker.enableBlockingInSession(session.defaultSession);
			console.log("Ad-Blocking Enabled");
		}
		
	}else{
		console.log("Ad-Blocking Disabled")
	}

	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 800,
		height: 600,
		webPreferences: { nodeIntegration: true,  preload: path.join(__dirname,"preload.js")},
		autoHideMenuBar: !utils.is.development,
		center: true,
		enableRemoteModule: true
	});

	win.on("ready-to-show", () => {
		win.show();
	});

	win.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, "index.html"));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	// Top Level Await not yet
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();
})();
