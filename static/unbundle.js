import React from "react";
import ReactDOM from "react-dom";
import { Skeleton } from "@material-ui/lab";
const Store = require('electron-store');
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
const regeneratorRuntime = require("regenerator-runtime");
console.log("bundle :D");
const columnTypes = {
	playlists: ["Name", "Date", "Songs Count"],
	songs: ["Name", "Artist", "Duration"],
};
const columnProps = {
	playlists: [item => item.name , item => item.createdAt, item => item.size]
}
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
		super(props );
		this.state = {
			pageIndex: 0,
			type: props.type,
			col1: i18n.__(columnTypes[props.type][0]),
			col2: i18n.__(columnTypes[props.type][1]),
			col3: i18n.__(columnTypes[props.type][2]),
			pageData: []
		};
		this.search.bind(this)();
	}
	shouldComponentUpdate(nextProps) {
		console.log("Update Request");
        const queryChanged = this.props.query !== nextProps.query;
        return queryChanged;
	}
	componentDidUpdate(prevProps){
		if(this.props.query !== prevProps.query){
			this.search();
		}
	}
	componentDidMount() {
		// Code to run when component starts
		console.log("Result View Mount")
		this.search();
		let componentThis = this;
		this.updateSearchInterval = setInterval(function(){
			if(componentThis.query){
				componentThis.search.bind(componentThis)();
			}
		}, 2500);
	}

	componentWillUnmount() {
		// Componoent dies -> deconstructor
		clearInterval(this.updateSearchInterval);
	}
	async search() {
		console.log("Running Search Request");
		let pageSize = settings.get("pageSize");
		let resp = await (await fetch(
			musicServer +
				"/api/fetch_" +
				this.state.type +
				"?" +
				serialize({
					limit: pageSize,
					offset: pageSize * this.state.pageIndex,
					name: this.props.query + "%",
				})
		)).json();
		if (resp.status == "ok") {
			let data = resp.data;
			console.log("Updating data for "+this.state.query);
			this.setState(function (state, props) {
				return {pageData: data};
			});
		}
	}
	render() {
		let comps = this.state.pageData.map(function(item){
			return <div className="row" key={item.id}>
					<div className="col s4">{item.name}</div>
					<div className="col s4">{item.createdAt}</div>
					<div className="col s4">{JSON.parse(item.contents).length}</div>
				</div>
		})
		
		return (
			<>
				<div className="row">
					<div className="col s4">{this.state.col1}</div>
					<div className="col s4">{this.state.col2}</div>
					<div className="col s4">{this.state.col3}</div>
				</div>
				{comps}
				<p>
		{i18n.__("Showing ")}{this.state.pageData.length} {i18n.__(" items")};
				</p>
			</>
		);
	}
}
class PlaylistView extends React.Component {
	constructor(props) {
		super();
		//super(props);
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
		//console.log(event);
		//console.log("Updating Search");
		let searchValue = event.target.value;
		console.log("New search value "+searchValue);
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
					className="searchbox"
					onChange={this.fetchSearch.bind(this)}
					onKeyUp={this.fetchSearch.bind(this)}
					placeholder={i18n.__("Type to search")}
				/>
				<ResultView
					type="playlists"
					query={this.state.searchBoxValue}
				></ResultView>
				<p>{i18n.__("Current querying ")} {settings.get("pageSize")} {i18n.__(" playlists matching the query ")} {this.state.searchBoxValue}</p>
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
