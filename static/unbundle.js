import React from "react";
import ReactDOM from "react-dom";
import { Skeleton } from "@material-ui/lab";
// Settings Loading
if(!Store){
	console.error("NO STORE found");
}
const settings = new Store({
	defaults: {
		pageSize: 25,
	},
});

//import {$} from "jquery";
const $ = require("jquery");
console.log("bundle :D");
const columnTypes = {
	playlists: ["Name", "Date", "Songs Count"],
	songs: ["Name", "Artist", "Duration"],
};
let musicServer = "http://localhost:3000"; // NO SLASH!
// RIP RepeatedComponent 2020 why did we need that anyway
function capitlizeFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
// https://stackoverflow.com/questions/7045065/how-do-i-turn-a-javascript-dictionary-into-an-encoded-url-string
function serialize(obj) {
	var str = [];
	for (var p in obj)
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	return str.join("&");
}
class ResultView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageIndex: 0,
			type: props.type,
			col1: i18n.__(columnTypes[props.type][0]),
			col2: i18n.__(columnTypes[props.type][1]),
			col3: i18n.__(columnTypes[props.type][2]),
			pageData: [],
			searchBoxValue: props.query
		};
	}
	componentDidMount() {
		// Code to run when component starts
		this.search();
		this.updateSearchInterval = setInterval(function(){
			if(this.query){
				this.search();
			}
		}, 10000);
	}

	componentWillUnmount() {
		// Componoent dies -> deconstructor
		clearInterval(this.updateSearchInterval);
	}
	search() {
		let pageSize = settings.get("pageSize");
		let resp = fetch(
			musicServer +
				"/api/fetch_" +
				this.state.type +
				"?" +
				serialize({
					limit: pageSize,
					offset: pageSize * this.state.pageIndex,
					name: this.state.searchBoxValue + "%",
				})
		);
		if (resp.status == "ok") {
			let data = resp.data;
			this.setState(function (state, props) {
				return {pageData: data};
			});
		}
	}
	render() {
		let comps = [];

		return (
			<>
				<div class="row">
					<div class="col s4">{this.state.col1}</div>
					<div class="col s4">{this.state.col2}</div>
					<div class="col s4">{this.state.col3}</div>
				</div>
				{comps}
			</>
		);
	}
}
class PlaylistView extends React.Component {
	constructor(props) {
		super(props);
		this.state = { searchBoxValue: "" };
		//this.fetchSearch = this.fetchSearch.bind(this);
	}
	componentDidMount() {
		// Code to run when component is destoryed -> constructor
	}

	componentWillUnmount() {
		// Componoent dies -> deconstructor
	}
	fetchSearch(event) {
		console.log(event);
		console.log("Updating Search");
		let searchValue = event.target.value;
		if (event.target.value) {
			this.setState(function (state, props) {
				return {
					searchBoxValue: searchValue,
				};
			});
		}
	}

	render() {
		return (
			<>
				<input
					type="text"
					id="searchbox-playlists"
					class="searchbox"
					onChange={this.fetchSearch.bind(this)}
					placeholder={i18n.__("Type to search")}
				/>
				<ResultView
					type="playlists"
					query={this.state.searchBoxValue}
				></ResultView>
				<div></div>
			</>
		);
	}
}
let views = {};
views.playlists = <PlaylistView />;

// Bootstrap code
if (uiManager) {
	console.log("Binding to uiManager");
	uiManager.on("launchview", function (data) {
		console.log(data);
		console.log("Rendering " + data.id);
		console.log(views[data.id]);
		ReactDOM.render(views[data.id], document.getElementById("contentview"));
	});
} else {
	console.log("Error ui manager not found");
}
