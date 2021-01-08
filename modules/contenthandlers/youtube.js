const prefix = "youtube://";
class YoutubeContentHandler{
    constructor(){
        this.prefferedPlayerKey = "youtubePlayerMethod";
    }
    canHandle(uri){
        return uri.startsWith(PREFIX);
    }
    getPlaybackMethod(){
        return require("../youtube_embed_iframe");
    }
    
}
module.exports = YoutubeContentHandler;