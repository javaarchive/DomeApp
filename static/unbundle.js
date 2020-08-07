import React from "react";
import ReactDOM from 'react-dom';
import { Skeleton } from '@material-ui/lab';
//import {$} from "jquery";
const $ = require("jquery");
console.log("bundle :D");
// RIP RepeatedComponent 2020 why did we need that anyway
let views = {};
views.playlists = <h1>Hi</h1>













// Bootstrap code
if(uiManager){
    console.log("Binding to uiManager")
    uiManager.on("launchview",function(data){
        console.log(data);
        console.log("Rendering "+data.id);
        console.log(views[data.id]);
        ReactDOM.render(views[data.id], document.getElementById("contentview"));
    })
}else{
    console.log("Error ui manager not found")
}