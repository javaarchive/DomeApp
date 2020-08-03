class Component extends React.Component {
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
    stateChange(){
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