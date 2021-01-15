const prefix = "youtube://";
class YoutubeContentHandler{
    constructor(){
        this.prefferedPlayerKey = "youtubePlayerMethod";
        this.id = "io.github.javaarchive.pulsify.ythandler"
    }
    canHandle(uri){
        return uri.startsWith(PREFIX);
    }
    
}
module.exports = YoutubeContentHandler;