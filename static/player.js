
// React Player to be imported 
// Meant to be reusable in other contexts
const hasArtist = ["Song"];
const hasMultipleArtists = ["Album"]; // Playlists are usually user created so they will have a variety of artists

class PlayerComponent extends React.Component {
    constructor(props) {
      super(props); // Deprecated but needed
      this.state = {
          itemName: ""
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
        <div class="player">
      <h4>{this.state.itemName}</h4>
        </div>
        </>
      );
    }
  }