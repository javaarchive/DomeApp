const ytdl = require("ytdl-core");
if (require.main === module) {
     (async function(){
        //console.log(process.argv);
        let info = await ytdl.getInfo(process.argv[2]);
        console.log(JSON.stringify(info));
    })();
}else{
   console.log("Info: ytinfo loaded as module")
    module.exports = ytdl.getInfo;
}