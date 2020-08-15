var i18n = require("i18n");
const config = require("./config");
i18n.configure({
    directory: __dirname + '/locales'
});
// Client Side Event Emitter
// Credits to https://stackoverflow.com/a/59563339/10818862
class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(event, data){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}
let uiManager = new EventEmitter();
function destroy(){
    window.close();
}
$(function(){
    console.log("Page has loaded");
    if(M){
        M.AutoInit();
    }else{
        console.log("Where's material?");
        console.warn("Materialize did not load");
    }
    if(React){
        console.log("Hello React World!");
    }else{
        console.log("Where are you React?");
        console.warn("React did not load");
    }
    if(EventEmitter){}else{
        console.log("Unable to find event emitter")
    }
    $(".tab").click(function(e){
        console.log(e);
        let tabid = $(e.currentTarget).find("a").attr("tabid");
        console.log("Launched "+tabid);
        console.log(tabid);
        uiManager.emit("launchview", {id: tabid});
    })
})
const Store = require("electron-store");