import React, {Component} from 'react';

import Navigation from './Navigation.jsx';
import AddressForm from './AddressForm.jsx';
import DriverForm from './DriverForm.jsx';
import PassengerForm from './PassengerForm.jsx';
import RouteForm from './RouteForm.jsx';


import HTMLTable from '../presentational/HTMLTable.jsx';
import gProvider from '../Providers/GetGlobal.jsx';






export default class DynamicContent extends Component {
  constructor(props) {
    super(props)
    this.embedded_component = React.createRef();

    this.embedContent = this.embedContent.bind(this);
  }



  // embed dynamic component
  embedContent(state) {
    switch (state.type) {
      case 'home':
        return <Navigation navigate={state.navigate} runDBFunction={state.runDBFunction} setModalContent={state.setModalContent} /> 
      case 'table': 
        return <HTMLTable name={state.form_data} navigate={state.navigate} query_db={state.query_db} data={state.data}  />;    
    }
    //console.log(state.form_data);
    switch (state.form_data) {
      case 'Address':
        return <AddressForm name={state.name} form_data={state.form_data} form_mode={state.form_mode} edit_id={state.edit_id} query_db={state.query_db} setModalContent={(title, msg, type) => state.setModalContent(title, msg, type)} />
      case 'Drivers':
        return <DriverForm name={state.name} form_data={state.form_data} navigate={state.navigate} form_mode={state.form_mode} edit_id={state.edit_id} query_db={state.query_db} setModalContent={(title, msg, type) => state.setModalContent(title, msg, type)} />
      case 'Passengers':
        return <PassengerForm name={state.name} form_data={state.form_data} navigate={state.navigate} form_mode={state.form_mode} edit_id={state.edit_id} query_db={state.query_db} setModalContent={(title, msg, type) => state.setModalContent(title, msg, type)} />
      case 'Routes':
        return <RouteForm name={state.name} form_data={state.form_data}  navigate={state.navigate} form_mode={state.form_mode} edit_id={state.edit_id} query_db={state.query_db} setModalContent={(title, msg, type) => state.setModalContent(title, msg, type)} />
    }
  }


  render() {
    const element = (<div>Text from Element</div>)
    //{() => <HTMLTable name={this.props.name} data={this.props.data} />}
  
    return (
      <div className="comptext">
        <gProvider.Consumer>
          {(global_state) => this.embedContent(global_state)}
        </gProvider.Consumer>
      </div>
    )
  }
}

