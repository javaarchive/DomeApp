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
const { ipcMain } = require("electron");
const { execFile } = require("child_process");
const settings = new Store({
	defaults: require("./static/prefdefaults.json"),
});

ipcMain.on("debug", function (event, msg) {
	console.log(msg);
});
let internalServerMethod = settings.get("internalServerExecutionMethod");
let internalServerObject;
let internalServerUp = false;
function updateStateToRenderer(ev) {
	console.log("Sent update to renderer");
	if (ev) {
		ev.reply("internalServerUpdates", {
			online: internalServerUp,
			method: internalServerMethod,
		});
	}
}
ipcMain.on("internalServer", async function (ev, eventName) {
	console.log("Running Internal Server Event", eventName);
	if (eventName == "start") {
		console.log("Starting internal server!");
		if (internalServerMethod == "childProcess") {
			// ! broken
			console.log("Using child process internal server startup");

			execFile(
				path.join(path.join(__dirname, "mediaserver"), "server.js"),
				(error, stdout, stderr) => {
					if (error) {
						console.error(`error: ${error.message}`);
						return;
					}

					if (stderr) {
						console.error(`stderr: ${stderr}`);
						return;
					}
				}
			);
			internalServerUp = true;
			updateStateToRenderer(ev);
		} else if (internalServerMethod == "moduleLoad") {
			internalServerObject = require("./mediaserver/server");
			internalServerUp = true;
			updateStateToRenderer(ev);
		}
	} else if (eventName == "stop") {
		if (internalServerMethod == "moduleLoad") {
			await internalServerObject.terminator.terminate();
			// internalServerObject.destroy();
			delete require.cache[require.resolve('./mediaserver/server')];
			internalServerUp = false;
			updateStateToRenderer(ev);
		}
	} else {
		updateStateToRenderer(ev);
	}
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
		if (!filters) {
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
			let filters = fs.readFileSync(settings.get("adblock-file"), {
				encoding: "utf-8",
			});
			const { ElectronBlocker } = require("@cliqz/adblocker-electron");
			blocker = ElectronBlocker.parse(filters);
			blocker.enableBlockingInSession(session.defaultSession);
			console.log("Ad-Blocking Enabled");
		}
	} else {
		console.log("Ad-Blocking Disabled");
	}

	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: settings.get("initialWindowWidth"),
		height: settings.get("initialWindowHeight"),
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
			nodeIntegrationInSubFrames: true, // Required, causes security issues but required for iframe control. Preload will sandbox
		},
		autoHideMenuBar: !utils.is.development,
		center: true,
		enableRemoteModule: true,
		titleBarStyle: settings.get("customWindowbar") ? "hidden" : "default",
		frame: !settings.get("customWindowbar"),
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

// ipcMain handles

let chList = settings.get("enabledContentHandlers");
let contentHandlers = [];
let contentPlayers = [];
for(let i = 0; i < N; i ++){
	
	try{
		let newCH = require(chList[i]);
		let newCP = require(settings.get(newCH.prefferedPlayerKey));
		contentHandlers.push(newCH);
		contentPlayers.push(newCP);
	}catch(ex){
		console.log("failed to load",chList[i]);
	}
}
ipcMain.on("annouce_existence", (ev, pageInfo) => {
	for(let i = 0; i < contentHandlers.length; i ++){
		if(contentHandlers[i].shouldControl && contentHandlers[i].shouldControl(pageInfo)){
			ev.reply("assign",{
				modulePath: settings.get(contentHandlers[i].prefferedPlayerKey),
				id: pageInfo.id
			});
			break; // For now only one page should be controlled at a time
		}
	}
})

(async () => {
	// Top Level Await not yet
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();
})();
