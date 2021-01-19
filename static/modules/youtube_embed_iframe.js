function waitForYTtoLoad(document,window) {
	if (document.ytLoaded) {
		return window.YT;
	}
	if (document.ytLoadingPromise) {
		return document.ytLoadingPromise;
	}
	let promise = new Promise((resolve, reject) => {
		window.onYouTubeIframeAPIReady = function () {
			document.ytLoaded = true;
			resolve(YT);
		};
	});
    document.ytLoadingPromise = promise;
    return promise;
}
function loadAPI(document) {
	var tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName("script")[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
class YoutubeEmbedIframePlayer {
	static id = "io.github.javaarchive.pulsify.youtube_embed_iframe_player";
	constructor(options) {
		// Constants
		
		// Save opts
		this.opts = options;
		if (!this.opts.privacyMode) {
			this.opts.privacyMode = false;
		}
		this.baseURL = this.opts.privacyMode
			? "https://www.youtube-nocookie.com/embed/"
			: "https://www.youtube.com/embed/"; // ! Important base urls
		this.playerState = -1;
	}
	onPlayerReady(event) {
		event.target.playVideo();
	}
	onPlayerStateChange(event) {
        console.log("New State",event.data);
		this.playerState = event.data;
		if (this.playerState == 2) {
			this.paused = true;
			this.buffering = false;
		} else if (this.playerState == 3) {
			this.buffering = true;
		} else if (this.playerState == 1) {
			this.paused = false;
			this.buffering = false;
		} else if (this.playerState == 0) {
			this.paused = true;
			this.buffering = false;
		} else if (this.playerState == -1) {
			this.buffering = true;
		}
	}
	async init(opts) {
        let curDocument = this.opts.document;
        let curWindow = this.opts.window;
		this.frame = curDocument.createElement("iframe");
		this.frame.src = this.baseURL + "8tPnX7OPo0Q?enablejsapi=1";
		this.frame.id = "player"
		if (this.opts.attachElement) {
			this.opts.attachElement.appendChild(this.frame);
		} else {
			curDocument.body.appendChild(this.frame);
		}
		loadAPI(curDocument);
		console.log("Waiting for yt to load");
        this.YT = await waitForYTtoLoad(curDocument,curWindow);
        console.log("Got YT",this.YT);
        
        this.playerReadyPromise = new Promise((resolve,reject) => {
            this.player = new this.YT.Player("player", {
			events: {
				'onReady': ev => {
                    console.log("iframe Player Ready");
                    this.onPlayerReady(ev); resolve(ev)
                },
				'onStateChange': this.onPlayerStateChange.bind(this),
			},
		});
		console.log("Created player instance",this.player);
        })
		await this.playerReadyPromise;
	}
	load(id, start, end) {
        
		id = id.replace("youtube://", ""); // TODO: use better practices
		let opts = { videoId: id };
		this.start = 0;
		if (start) {
			opts["startSeconds"] = start;
		}
		if (end) {
			opts["endSeconds"] = end;
        }
        let curWindow = this.opts.window;
        console.log(this.player);
		this.player.loadVideoById(opts);
	}
	pause() {
		this.player.pauseVideo();
	}
	resume() {
		this.player.playVideo();
	}
	play() {
		this.player.playVideo();
	}
	setTime(num) {
		this.player.seekTo(num, true);
	}
	getDuration() {
		return this.player.getDuration();
	}
	get duration() {
		return this.getDuration();
	}
	getCurrentTime() {
		return player.getCurrentTime();
	}
	get curTime() {
		return this.getCurrentTime();
	}
}
module.exports = YoutubeEmbedIframePlayer;
