import {React} from "React/addons";
import { Skeleton } from '@material-ui/lab';
console.log("bundle :D");
class RepeatedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {size: props.size,comp: null};
    }
    
    render(){
        let list = Array.from(Array(10).keys()).map((number) =>
  {React.cloneWithProps(this.props.children)});
        return <span>{list}</span>;
    }
    
    componentDidMount() {
      // Code to run when component is destoryed -> constructor
    }
  
    componentWillUnmount() {
      // Componoent dies -> deconstructor
    }
    setSize(size){
      this.setState(function(state, props) {
        return {
          size: size
        };
      });
    }
    setComp(comp){
        this.setState(function(state, props) {
          return {
            comp: comp
          };
        });
      }
}