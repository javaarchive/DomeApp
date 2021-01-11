
function waitForYTtoLoad(document){
    if(document.ytLoaded){
        return window.YT;
    }
    if(document.ytLoadingPromise){
        return document.ytLoadingPromise;
    }
    let promise = new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = function(){
        document.ytLoaded = true;
        resolve(YT);
    }
    document.ytLoadingPromise = promise;
});
}
function loadAPI(document){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
class YoutubeEmbedIframePlayer{
    constructor(options){
        this.opts = options;
        this.baseURL = this.opts.privacyMode?"https://www.youtube-nocookie.com/embed/":"https://www.youtube.com/embed/"; // ! Important base urls
        this.playerState = -1;
    }
    onReady(event){
        event.target.playVideo();
    }
    onPlayerStateChange(event){
        this.playerState = event.data;
        if(this.playerState == 2){
            this.paused = true;
            this.buffering = false;
        }else if(this.playerState == 3){
            this.buffering = true;
        }else if(this.playerState == 1){
            this.paused = false;
            this.buffering = false;
        }else if(this.playerState == 0){
            this.paused = true;
            this.buffering = false;
        }else if(this.playerState == -1){
            this.buffering = true;
        }
    }
    async init(opts){
        this.frame = document.createElement("iframe");
        this.frame.src=this.baseURL + "?jsapi=1";
        if(opts.attachElement){
            opts.attachElement.appendChild(this.frame);
        }else{
            document.body.appendChild(this.frame);
        }
        loadAPI(document);
        this.YT = await waitForYTtoLoad();
        this.player = new YT.Player('player', {
            events: {
              'onReady': this.onPlayerReady.bind(this),
              'onStateChange': this.onPlayerStateChange.bind(this)
            }
          });

    }
    load(id,start,end){
        let opts = {"videoId":id};
        this.start = 0;
        if(start){
            opts["startSeconds"] = start;
        }
        if(end){
            opts["endSeconds"] = end;
        }
        window.loadVideoById(opts);
    }
    pause(){
        this.player.pauseVideo();
    }
    resume(){
        this.player.playVideo();
    }
    setTime(num){
        this.player.seekTo(num,true);
    }
    getDuration(){
        return this.player.getDuration();
    }
    get duration(){
        return this.getDuration();
    }
    getCurrentTime(){
        return player.getCurrentTime();
    }
    get curTime(){
        return this.getCurrentTime();
    }
}
module.exports = YoutubeEmbedIframePlayer;