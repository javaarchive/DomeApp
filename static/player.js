import React from "react";
import ReactDOM from "react-dom";
// Fonts (broken currently)
// import "fontsource-roboto";
// Styles
import styles from "./player.module.css";
import Typography from "@material-ui/core/Typography";

// React Player to be imported 
// Meant to be reusable in other contexts
const hasArtist = ["Song"];
const hasMultipleArtists = ["Album"]; // Playlists are usually user created so they will have a variety of artists
if(!i18n){
    try{
        var i18n = require("i18n");
    }catch(ex){
        var i18n = null; // Allow custom instances to be added later.
    }
} // Might already be init
class PlayerComponent extends React.Component {
    constructor(props) {
      super(props); // Deprecated but needed
      this.state = {
          itemName: i18n.__("Nothing Playing")
      };
    }
    componentDidMount() {
      // Code to run when component is destoryed -> constructor
    }
  
    componentWillUnmount() {
      // Componoent dies -> deconstructor
    }
    updateItem(type,params){
        let properties = {};
        
        if("name" in params){
            properties.itemName = params.name;
        }
        if(hasArtist.includes(type)){
            if("artist" in params){
                properties.itemMadeBy = params.artist;
            }
        }
        if("duration" in params){
            properties.duration = params.duration;  
        }else{
            properties.duration = null; // Not provided
        }
        
        
        this.setState(function(state, props) {
            return properties;
        });
        

    }
    updateDuration(time){
        // Sometimes duration can be found afterwards
        this.setState(function(state, props) {
            return {itemDuration: time};
        });
    }
    render() {
      return (
        <>
        <div className="player">
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
console.log("Imported styles",styles);
export {PlayerComponent};