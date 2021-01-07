const prefix = "youtube://";
class YoutubeEmbedIframePlayer{
    constructor(options){
        this.opts = options;
        this.baseURL = this.opts.privacyMode?"https://www.youtube-nocookie.com/embed/":"https://www.youtube.com/embed/"; // ! Important base urls
    }
    canHandle(uri){
        return (uri.startsWith(PREFIX))
    }
    init(){
        this.frame = document.createElement("iframe");
        this.frame.src=this.baseURL;
    }
}