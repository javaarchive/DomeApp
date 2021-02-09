class PlayerName{
    // Player Naming is not required
    // if you do change it make sure to change the export
    static id="com.example.moduledomain"; // you should own this domain
    static optsKey = "sampleOptsKey";
    constructors(options){
        // Save opts
        this.opts = options;
        // Calculate properties

        // your code here...
    }
    
    getDocumentLoadFunc(){
        return function(windowContext){

        }; // not required but will be executed in other contexts
    }
    
    
    async init(){
        // Create elements
    }

    async load(uri, start, end){
        this.opts = {};
        if(start){
            this.opts.start = start;
        }else{
            this.opts.start = 0;
        }
        if(end){
            this.opts.end = end;
        }
    }

    pause(){

    }

    resume(){

    }

    play(){
        // Called in case autoplay is not set
    }

    // ! The following functions do not take into account the start and end options
    getDuration(){
        // Return the duration of the item in seconds
    }
    getCurrentTime(){
        // Return the current elapsed playback time in seconds
    }
    // Not required but here for syntatic sugar
    get duration(){
        return this.getDuration();
    }
    get curTime(){
        return this.getCurrentTime();
    }
}
module.exports = PlayerName;