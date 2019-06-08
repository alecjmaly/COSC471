import React, {Component} from 'react';


export default class Modal extends Component {
  constructor(props) {
    super(props);

    
    this.titleRef = React.createRef();
    this.msgRef = React.createRef();

    this.escFunction = this.escFunction.bind(this);
  }

  escFunction() {
    if(event.keyCode === 27) {
      this.props.close_modal();
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }


  componentDidUpdate() {
    this.refs.titleRef.innerHTML = this.props.modal_data.title;
    this.refs.msgRef.innerHTML = this.props.modal_data.msg;
  }

 
  

  render() {
    return (
        <div id="myModal" className="modal" style={ this.props.modal_data.msg.length > 0 ? {'display':'block'} : {'display':'none'}}>
          <div className="modal-content">
          
            <h1 id='modal_title' className={this.props.modal_data.type}>
              <span ref='titleRef' />
              <span className="close" name='home' onClick={(evt) => this.props.close_modal()}>&times;</span>
            </h1>
            
            <p id='modal_msg' ref='msgRef'></p>
          </div>
      </div>
    )
  }
}


