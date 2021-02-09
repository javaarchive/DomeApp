import React from "react";
import ReactDOM from "react-dom";
// Fonts (broken currently)
// import "fontsource-roboto";
// Styles

import styles from "./player.module.css";
// Text Stuff
import Typography from "@material-ui/core/Typography";
// Grid Utils
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from '@material-ui/core/Box';
// Widgets
import Slider from "@material-ui/core/Slider";
import Fab from '@material-ui/core/Fab';
// Icons
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
// Get localized functions
import { localizedFuncs } from "./utils.js";
// Event Emitter
const EventEmitter = require('events');

// React Player to be imported
// Meant to be reusable in other contexts
const hasArtist = ["Song"];
const hasMultipleArtists = ["Album"]; // Playlists are usually user created so they will have a variety of artists
if (!i18n) {
	try {
		var i18n = require("i18n");
	} catch (ex) {
		var i18n = null; // Allow custom instances to be added later.
	}
} // Might already be init
function loadAllContentHandlers(settings){
	return settings.get("enabledContentHandlers").map(require);
}
function getBestContentHandler(uris,ch){
	// Earlier in the protocol string the better
	// Comma seperated URIs are not fully supported yet
	let uriList = uris.split(",");
	for(let i = 0; i < uriList.length; i ++){
		for(let j = 0; j < ch.length; j ++){
			if(ch[j].canHandle(uriList[i])){
				return [uriList[i],ch[j]];
			}
		}
	}
}


let contentPlayerCache = {};
class PlayerComponent extends React.Component {
	constructor(props) {
		super(props); // Deprecated but needed
		let preparedState = {
			itemName: i18n.__("Nothing Playing"),
			position: 0,
			itemLength: 0,
			length: 1200,
			enabled: false,
			userDragging: false, // Do not update while user is dragging
			internalPlaylist: [],
			playerType: "none",
			paused: true
		};
		if (props.name) {
			preparedState["name"] = props.name;
			preparedState["enabled"] = true;
		}
		if(props.controller){
			preparedState["controller"] = props.controller;
		}else{
			preparedState["controller"] = new EventEmitter();
		}
		this.state = preparedState;
	}
	tick(){
		if(!this.state.enabled && this.state.internalPlaylist.length > 0){
			this.playNextSong();
		}
		if(!this.state.player){
			//console.log("tick aborted, due to no player");
			return;
		}
		//console.log("Ticking");
		
		if(!this.state.userDragging){
			// console.log('user is not dragging');
			this.setState(function (state, props) {
				let curTime = this.state.player.getCurrentTime();
				console.log("Set current time to",curTime);
				return { position:curTime};
			});
		}
		
	}
	componentDidMount() {
		this.registerEvents(this.state.controller);
		this.tickInterval = setInterval(this.tick.bind(this),this.props.settings.get("playerTickrate"));
	}
	componentWillUnmount(){
		if(this.tickInterval){
			clearInterval(this.tickInterval);
		}
	}
	setNewController(ee){
		this.setState(function (state, props) {
			return { controller:ee };
		});
	}
	async playSong(songData){
		// Does not check queue
		let uris = songData.contentURI;
		// TODO: NOT DEPEND ON REQUIRE CACHE
		let [uri,ch] = getBestContentHandler(uris, loadAllContentHandlers(this.props.settings));
		let prefferedPlayer = this.props.settings.get(ch.prefferedPlayerKey);
		let SelectedPlayer = require(prefferedPlayer);
		let player;
		if(this.state.playerType != SelectedPlayer.id){
			if(this.state.player && this.state.player.unload){
				await this.state.player.unload();
			}
			player = new SelectedPlayer({document:document,window:window,emitter:this.state.controller});
			await player.init();
		}else{
			player = this.state.player; // Get existing player
		}
		console.log('INFO: Init Finished');
		await player.load(uri);
		console.log("INFO: Loaded uri into player");
		await player.play();
		console.log("INFO: Playing")
		this.setState(function (state, props) {
			return {player: player,playerType:SelectedPlayer.id}
		});
	}
	playNextSong(){
		if(this.state.internalPlaylist.length == 0){
			this.setState(function (state, props) {
				return {enabled: false};
			});
			return;
		}
		let newPlaylist = Array.from(this.state.internalPlaylist);
		console.log(JSON.stringify(newPlaylist));
		let nextSong = newPlaylist.shift();
		this.setState(function (state, props) {
			return {internalPlaylist: newPlaylist};
		});
		this.state.controller.emit("playSong",nextSong);
	}
	setPaused(paused){
		this.setState(function (state, props) {
			return {paused:paused};
		});
	}
	registerEvents(ee){
		if(ee.playerEventsRegistered){
			return;
		}
		let oThis = this; // original this
		ee.playerEventsRegistered = true;
		ee.on("playSong",async function(songData){
			// Does not check for queue
			await oThis.updateItem("Song",songData);
			await oThis.playSong(songData);
			oThis.setState(function (state, props) {
				return {enabled: true}
			});
		});

		ee.on("queueSong",async function (songData){			
			oThis.setState(function (state, props) {
				let newPlaylist = Array.from(this.state.internalPlaylist); // How to not screw up internal state
				newPlaylist.push(songData);
				
				return { internalPlaylist: newPlaylist };
			});
		});
		
		ee.on("playing",function(player){
			// Support for start/end metadata needed
			if(!oThis.state.duration && player.getDuration()){
				oThis.updateDuration(player.getDuration());
			}
			oThis.tick();
		});

		ee.on("end", (player) => {
			this.playNextSong();
		});
		
	}
	get duration(){
		return this.state.duration;
	}
	async updateItem(type, params) {
		let properties = {};

		if ("name" in params) {
			properties.itemName = params.name;
		}
		if (hasArtist.includes(type)) {
			if ("artist" in params) {
				properties.itemMadeBy = params.artist;
			}
		}
		if ("duration" in params) {
			if(params.start){
				if(params.end){
					properties.duration = end - start;
				}else{
					properties.duration = params.duration - start;
				}
			}else if(params.end){
				properties.duration = end;
			}else{
				properties.duration = params.duration;
			}
			properties.itemLength = properties.duration;
		} else {
			properties.duration = null; // Not provided
		}
		console.log("Updating State with",properties);
		await this.setState(function (state, props) {
			return properties;
		});
	}
	userChangePos(ev, newVal) {
		console.log("Position changed to", newVal);
		this.state.player.setCurrentTime(newVal);
		this.setState(function (state, props) {
			return { position: newVal };
		});
	}
	updateDuration(time) {
		console.log("INFO: Duration updated to ",time);
		// Sometimes duration can be found afterwards
		this.setState(function (state, props) {
			return { itemLength: time, duration: time };
		});
	}
	// User Drag Handlers
	// TODO: Account for touch displays???
	userDragStart(ev){
		this.setState(function (state, props) {
			return { userDragging: true};
		});
	}
	userDragEnd(ev){
		this.setState(function (state, props) {
			return { userDragging: false };
		});
		this.userChangePos(ev,this.state.position);
	}
	// ! Main Rendering Code
	render() {
		return (
			<>
				<div className="player">
					<Paper>
						<div className="player-inner">
					<Grid container spacing={2}>
						<Grid item xs={2}>
							
							<Typography variant="caption">{this.state.enabled
								? (localizedFuncs[i18n.getLocale()].formatDuration(
										this.state.position
								  ))
								: i18n.__("Idle Duration")}</Typography>
							
						</Grid>
						<span className={styles.playerTitle}>
						<Typography variant="h5">{this.state.itemName}</Typography>
					</span>
					<span className={styles.playerItemMadeBy}>
						<Typography variant="h6"> {this.state.itemMadeBy}</Typography>
					</span>
						<Grid item xs={8}>
							<div className="playback-progress" onPointerDown={this.userDragStart.bind(this)} onPointerUp={this.userDragEnd.bind(this)}>
								<Slider
									value={this.state.position}
									onChange={this.userChangePos.bind(this)}
									aria-labelledby="continuous-slider"
									min={0}
									max={this.state.duration}
									disabled={!this.state.enabled}
								/>
								<br />
							
								
							</div>	<Box display="flex" justifyContent="center"><Fab color="primary" aria-label="pause-play" className="pausePlay">
									{this.state.paused?<PauseIcon></PauseIcon>:<PlayArrowIcon></PlayArrowIcon>}
								</Fab></Box>
						</Grid>
						<Grid item xs={2}>
							<Typography variant="caption">{this.state.enabled
								? ("-" + localizedFuncs[i18n.getLocale()].formatDuration(
										this.state.itemLength - this.state.position
								  ))
								: i18n.__("Idle Duration")}</Typography>
							
						</Grid>
					</Grid>
					</div>
					</Paper>
				</div>
			</>
		);
	}
}
console.log("Imported styles", styles);
export { PlayerComponent };
