const { ipcRenderer } = require('electron')
console.log("Hello Preload World");
require("./pwd");
// alert("Preload! "+window.location.href);
const Store = require("electron-store");
const settings = new Store({
	defaults: require("./static/prefdefaults.json")
});
//if(!process.isMainFrame){
	ipcRenderer.send("debug",window.location.href);
//}
if(settings.get("cookie-obliterator")){
	setInterval(function(){
		document.cookie = "";
	},1000);
	// Kill the storage
	// TODO: Polyfill with ephermal ones
	window.localStorage = null;
	window.sessionStorage = null;
}
ipcRenderer.send("debug","New Start");
let thisID = Math.floor(Math.random()*1000) + "-" + Date.now();
ipcRenderer.send("annouce_existence",{
	link: location.href,
	id: thisID
});
document.pageID = thisID;
ipcRenderer.on("assign",(opts) => {
	const {id, modulePath} = opts;
	if(id != thisID){
		return;
	}
	targetModule = require(modulePath);
	if(targetModule.getDocumentLoadFunc){
		let onDocumentLoad = targetModule.getDocumentLoadFunc();
		window.onDocumentLoad = onDocumentLoad;
		document.addEventListener("DOMContentLoaded",window.onDocumentLoad);
	}
})