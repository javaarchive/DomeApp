var i18n = require("i18n");
i18n.configure({
    directory: __dirname + '/locales'
});
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
    $(".tab").click(function(e){
        console.log(e);
        let tabid = $(e.currentTarget).first().attr("tab-id");
        console.log(tabid);
    })
})