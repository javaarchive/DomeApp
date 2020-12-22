import React from "react";
import ReactDOM from "react-dom";
// Fonts

// broken?
// Roboto font for material
//import 'fontsource-roboto'; // Workaround parcel issue?

// Core components
import { Skeleton } from "@material-ui/lab";
import { Container } from "@material-ui/core";
// import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

// Utilites
import { makeStyles } from "@material-ui/core/styles";

// Ui icons
import MenuIcon from "@material-ui/icons/Menu"; // Also called a hamburger
import StorageIcon from "@material-ui/icons/Storage";

// Ui Widgets
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";

// Reusable Player Componoent
import { PlayerComponent } from "./player";

const Store = require("electron-store");
// Settings Loading
if (!Store) {
	console.warn("NO STORE found");
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
import {localizedFuncs} from "./utils.js";

// Constants
const columnTypes = {
	playlists: ["Name", "Date", "Songs Count"],
	songs: ["Name", "Artist", "Duration"],
	albums: ["Name", "Last Updated", "Songs"],
};
const columnProps = {
	playlists: [
		(item) => item.name,
		(item) => item.createdAt,
		(item) => JSON.parse(item.contents).length,
	],
	songs: [
		(item) => item.name,
		(item) => item.artist,
		(item) => (item.duration ? localizedFuncs[i18n.getLocale()].formatDuration(item.duration) : "Unknown"),
	],
	albums: [
		(item) => item.name,
		(item) => item.updatedAt,
		(item) => JSON.parse(item.contents).length,
	],
};

let musicServer = "http://localhost:3000"; // NO SLASH!
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
function calcColClass(cols) {
	return "s" + 12 / cols;
}
class ResultView extends React.Component {
	constructor(props) {
		super(props); // Deprecated but needed anyway
		this.state = {
			pageIndex: 0,
			type: props.type,
			col1: i18n.__(columnTypes[props.type][0]),
			col2: i18n.__(columnTypes[props.type][1]),
			col3: i18n.__(columnTypes[props.type][2]),
			pageData: [],
		};
		this.search.bind(this)();
	}
	shouldComponentUpdate(nextProps) {
		console.info("Update Request");
		const queryChanged = this.props.query !== nextProps.query;
		return queryChanged;
	}
	componentDidUpdate(prevProps) {
		if (this.props.query !== prevProps.query) {
			this.search();
		}
	}
	componentDidMount() {
		// Code to run when component starts
		console.info("Result View Mounted");
		this.search();
		let componentThis = this;
		this.updateSearchInterval = setInterval(function () {
			if (componentThis.query) {
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
		let resp = await (
			await fetch(
				musicServer +
					"/api/fetch_" +
					this.state.type +
					"?" +
					serialize({
						limit: pageSize,
						offset: pageSize * this.state.pageIndex,
						name: this.props.query + "%",
					})
			)
		).json();
		if (resp.status == "ok") {
			let data = resp.data;
			console.log("Updating data for " + this.state.query);
			this.setState(function (state, props) {
				return { pageData: data };
			});
		}
	}
	render() {
		let colgenerator = function (item) {
			// TODO: Move col sizes to constants
			return (
				<div
					className="row wide-item waves-effect waves-light"
					key={item.id}
					data-id={item.id}
					onClick={this.props.onItemClick}
				>
					<div className="col s6">{columnProps[this.props.type][0](item)}</div>
					<div className="col s3">{columnProps[this.props.type][1](item)}</div>
					<div className="col s3">{columnProps[this.props.type][2](item)}</div>
				</div>
			);
		};
		let comps = this.state.pageData.map(colgenerator.bind(this));

		return (
			<div className="results-wrapper">
				<div className="row wide-item">
					<div className="col s6">{this.state.col1}</div>
					<div className="col s3">{this.state.col2}</div>
					<div className="col s3">{this.state.col3}</div>
				</div>
				<div className="results-rows">{comps}</div>
				<p>
					{i18n.__("Showing ")}
					{this.state.pageData.length} {i18n.__(" items")};
				</p>
			</div>
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
		//console.log("New search value "+searchValue);
		if (event.target.value) {
			this.setState(function (state, props) {
				return {
					searchBoxValue: searchValue,
				};
			});
		}
	}
	onItemClick(e) {
		console.log("Item Click", e, this);
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
					onItemClick={this.onItemClick.bind(this)}
				></ResultView>
				<p>
					{i18n.__("Current querying ")} {settings.get("pageSize")}{" "}
					{i18n.__(" playlists matching the query ")}{" "}
					{this.state.searchBoxValue}
				</p>
				<div></div>
			</>
		);
	}
}
class SongView extends React.Component {
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
		//console.log("New search value "+searchValue);
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
				<ResultView type="songs" query={this.state.searchBoxValue}></ResultView>
				<p>
					{i18n.__("Current querying ")} {settings.get("pageSize")}{" "}
					{i18n.__(" songs matching the query ")} {this.state.searchBoxValue}
				</p>
				<div></div>
			</>
		);
	}
}
// Home View
// TODO: Populate with intresting things
class HomeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		// Code to run when component is destoryed -> constructor
	}

	componentWillUnmount() {
		// Componoent dies -> deconstructor
	}
	stateChange() {
		this.setState(function (state, props) {
			return {};
		});
	}
	render() {
		return (
			<>
				<Typography variant="h3">{i18n.__("Hello! This is the default homescreen for now. ")}</Typography>
			</>
		);
	}
}
// Legacy Views System

let views = {};
views.playlists = <PlaylistView />;
views.songs = <SongView />;
views.homeview = <HomeComponent />;
window.debug = {};
window.debug.views = views;

// Main Comp
function MainComponent(){
		
		let [anchorEl, setAnchorEl] = React.useState(null);
		function handleMenu(event){
			console.log(this);
			setAnchorEl(event.target);
		}
		function handleClose(event){
			console.log(this);
			setAnchorEl(null);
		}
		//let [open] = React.useState(true);
		let [curView] = React.useState("homeview");
		const open = Boolean(anchorEl);
		const stylesSet = makeStyles((theme) => ({
			root: {
				flexGrow: 1,
			},
			title: {
				flexGrow: 1,
			},
			menuButton: {
				marginRight: theme.spacing(2),
			},
		}));
		const classes = stylesSet();
		return <>
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{i18n.__("App Name")}
					</Typography>
					<div>
						<IconButton color="inherit" aria-label="Switch Media Server" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}>
							<StorageIcon/>
						</IconButton>
						<Menu id="menu-appbar"
						anchorEl={anchorEl} 
						anchorOrigin={{vertical:'top',horizontal:'right'}}
						 keepMounted 
						 transformOrigin={{vertical:'top',horizontal:'right'}}
					     onClose={handleClose}
						 open={open}
						 >
							<MenuItem onClick={setServer}>
								Local
							</MenuItem>
							<MenuItem onClick={setServer}>
								Add new server
							</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<Container maxWidth="md">{views[curView]}</Container>

			<PlayerComponent />
		</div>
	</>;
}
// Bootstrap code
// really odd part i'm learning

function setServer(comp){
	
}

$(function () {
	// TODO: Replace with Vanilla JS to make script size smaller
	

	ReactDOM.render(
		<MainComponent />,
		document.getElementById("root")
	);
});

console.log("Player Comp", PlayerComponent);
