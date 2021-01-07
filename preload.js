console.log("Hello Preload World");
require("./pwd");
// alert("Preload!");
const Store = require("electron-store");
const settings = new Store({
	defaults: require("./static/prefdefaults.json")
});
if(settings.get("cookie-obliterator")){
	setInterval(function(){
		document.cookie = "";
	},1000);
	// Kill the storage
	window.localStorage = null;
	window.sessionStorage = null;
}