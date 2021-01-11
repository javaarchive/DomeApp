const prefix = "youtube://";
class YoutubeContentHandler{
    constructor(){
        this.prefferedPlayerKey = "youtubePlayerMethod";
    }
    canHandle(uri){
        return uri.startsWith(PREFIX);
    }
    
}
module.exports = YoutubeContentHandler;