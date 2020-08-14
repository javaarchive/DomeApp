import React from "react";
import ReactDOM from "react-dom";
import { Skeleton } from "@material-ui/lab";
//import {$} from "jquery";
const $ = require("jquery");
const config = require("./config");
console.log("bundle :D");
// RIP RepeatedComponent 2020 why did we need that anyway
class ResultView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {type: props.type};
    }
    componentDidMount() {
      // Code to run when component is destoryed -> constructor
    }
  
    componentWillUnmount() {
      // Componoent dies -> deconstructor
    }
    search(){
		//let data = fetch(+"");
      this.setState(function(state, props) {
        return {
          
        };
      });
      
    }
    render() {
      return (
        <div>
          <h1>{}</h1>
        </div>
      );
    }
  }
class PlaylistView extends React.Component {
	constructor(props) {
		super(props);
	this.state = { searchBoxValue: "" };
	this.mySearchView = <ResultView type="playlist"></ResultView>
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
			this.setState(function(state, props) {
				return {
					searchBoxValue: searchValue
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
			{this.mySearchView}
      <div>
        
      </div>
      </>
		);
	}
}
let views = {};
views.playlists = <PlaylistView />;

// Bootstrap code
if (uiManager) {
	console.log("Binding to uiManager");
	uiManager.on("launchview", function(data) {
		console.log(data);
		console.log("Rendering " + data.id);
		console.log(views[data.id]);
		ReactDOM.render(views[data.id], document.getElementById("contentview"));
	});
} else {
	console.log("Error ui manager not found");
}
