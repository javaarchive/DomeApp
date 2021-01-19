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
// Widgets
import Slider from "@material-ui/core/Slider";
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
			internalPlaylist: []
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
		if(!this.player){
			return;
		}
		if(!this.state.userDragging){
			this.setState(function (state, props) {
				return { position:this.state.player.getDuration()};
			});
		}
	}
	componentDidMount() {
		this.registerEvents(this.state.controller);
		setInterval(this.tick.bind(this),this.props.settings.get("playerTickrate"));
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
		let player = new SelectedPlayer({document:document,window:window});
		await player.init();
		console.log('Init Finished');
		await player.load(uri);
		console.log("Loaded uri into player");
		await player.play();
		console.log("Playing")
		this.setState(function (state, props) {
			return {player: player}
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
			oThis.updateItem("Song",songData);
			await oThis.playSong(songData);
			oThis.setState(function (state, props) {
				return {enabled: true}
			});
		});

		ee.on("queueSong",async function (songData){
			oThis.setState(function (state, props) {
				let newPlaylist = new Array(this.state.internalPlaylist);
				newPlaylist.push(songData);
				return { internalPlaylist: newPlaylist };
			});
		});
	}
	componentWillUnmount() {
		// Componoent dies -> deconstructor
	}
	get duration(){
		return this.state.duration;
	}
	updateItem(type, params) {
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
		} else {
			properties.duration = null; // Not provided
		}

		this.setState(function (state, props) {
			return properties;
		});
	}
	changePos(ev, newVal) {
		console.log("Position changed to", newVal);
		this.setState(function (state, props) {
			return { position: newVal };
		});
	}
	updateDuration(time) {
		// Sometimes duration can be found afterwards
		this.setState(function (state, props) {
			return { itemDuration: time };
		});
	}
	setPosition(num){

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
	}
	// ! Main Rendering Code
	render() {
		return (
			<>
				<div className="player">
					<Grid container spacing={2}>
						<Grid item xs={2}>
							
							<Typography variant="caption">{this.state.enabled
								? (localizedFuncs[i18n.getLocale()].formatDuration(
										this.state.position
								  ))
								: i18n.__("Idle Duration")}</Typography>
							
						</Grid>
						<Grid item xs={8}>
							<div className="playback-progress" onPointerDown={this.userDragStart.bind(this)} onPointerUp={this.userDragEnd.bind(this)}>
								<Slider
									value={this.state.position}
									onChange={this.changePos.bind(this)}
									aria-labelledby="continuous-slider"
									min={0}
									max={this.state.length}
									disabled={!this.state.enabled}
								/>
							</div>
						</Grid>
						<Grid item xs={2}>
							<Typography variant="caption">{this.state.enabled
								? ("-" + localizedFuncs[i18n.getLocale()].formatDuration(
										Math.abs(this.state.itemLength - this.state.position)
								  ))
								: i18n.__("Idle Duration")}</Typography>
							
						</Grid>
					</Grid>
					<span className={styles.playerTitle}>
						<Typography variant="h5">{this.state.itemName}</Typography>
					</span>
					<span className={styles.playerItemMadeBy}>
						<Typography variant="h6">{this.state.itemMadeBy}</Typography>
					</span>
				</div>
			</>
		);
	}
}
console.log("Imported styles", styles);
export { PlayerComponent };
