const prefix = "youtube://";
class YoutubeContentHandler{
    canHandle(uri){
        return uri.startsWith(PREFIX);
    }
    getPlaybackMethod(){
        return require("../youtube_embed_iframe");
    }
}
module.exports = YoutubeContentHandler;