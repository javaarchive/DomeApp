class Component extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
      return <h1>Sample Componoent</h1>
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