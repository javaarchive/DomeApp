var i18n = require("i18n"); // Electron require NOT parcel
const config = require("./config");
i18n.configure({
    directory: __dirname + '/locales'
});
// Client Side Event Emitter
// Credits to https://stackoverflow.com/a/59563339/10818862

const Store = require("electron-store");