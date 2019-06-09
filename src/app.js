
import React, { Component } from 'react';
import DynamicContent from './js/components/container/DynamicContent.jsx';
import './styles.css';


import Modal from './js/components/presentational/Modal.jsx';
import gProvider from './js/components/Providers/GetGlobal.jsx';

const root_uri = process.env.PORT ? "https://cosc471-demo-server.herokuapp.com" : "http://localhost:3000";





class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page_history: [],

      name: 'People',
      data: this.query_db('SELECT * FROM People'),
      table_qry: 'SELECT * FROM People',
      type: 'home',  // home | table | form
      form_data: '', // People | Drivers | Passengers | Routes | Address
      form_mode: 'new',
      edit_id: '',
      modal_data: {
        title: '',
        msg: '',
        type: 'modal-normal' // modal-error | moodal-normal | modal-success
      },

      query_db: (qry) => this.query_db(qry),
      navigate: (evt) => this.navigate(evt),
      runDBFunction: (str) => this.runDBFunction(str),
      setModalContent: (title, msg, type) => this.setState({
          modal_data: {
            title: title || '', 
            msg: msg || '',
            type: type || ''
          }
        }
      )
    };
  
    this.navigate = this.navigate.bind(this);
    this.runDBFunction = this.runDBFunction.bind(this);
    this.query_db = this.query_db.bind(this);
  }


  // Ping to wake API server 
  componentDidMount() {
    fetch(root_uri, { mode: 'cors' })  
  }

  async navigate(evt) {
    var page_history_arr = this.state.page_history;
    page_history_arr.push({ 
      name: this.state.name,
      data: this.state.data,
      table_qry: this.state.table_qry,
      
      type: this.state.type, 
      form_data: this.state.form_data, 
      form_mode: this.state.form_mode, 
      edit_id: this.state.edit_id,
      data: this.state.data 
    });

    switch (evt.target.attributes.name.value) {
      case 'home':
        this.setState({ type: 'home' })
        page_history_arr = [];
        break;
      case 'back':
        const prev_page = page_history_arr.slice(-2)[0];
        page_history_arr = page_history_arr.slice(0, -2);
        console.log('previous page');
        console.log(prev_page);
        let prev_page_data = prev_page.data;
        if (prev_page.type === 'table') {
          prev_page_data = await this.query_db(prev_page.table_qry);
        }


        this.setState({
          name: prev_page.name,
          data: prev_page_data,
          table_qry: prev_page.table_qry,

          type: prev_page.type,
          form_data: prev_page.form_data,
          form_mode: prev_page.form_mode,
          edit_id: prev_page.edit_id
        });

        break;

      case 'getPeople':
        this.setState({ type: 'table', form_data: 'People', table_qry: 'SELECT * FROM People'}, () => this.query_db(this.state.table_qry))
        break;
      case 'getCreditCards':
        this.setState({ type: 'table', form_data: 'CreditCards', table_qry: 'SELECT * FROM Credit_Card'}, () => this.query_db(this.state.table_qry))
        break;
      case 'getVehicles':
        this.setState({ type: 'table', form_data: 'Vehicles', table_qry: 'SELECT * FROM Vehicle'}, () => this.query_db(this.state.table_qry))
        break;
      case 'getDrivers':
        this.setState({ type: 'table', form_data: 'Drivers', table_qry: 'SELECT * FROM Drivers'}, () => this.query_db(this.state.table_qry))
        break;
      case 'getPassengers':
        this.setState({ type: 'table', form_data: 'Passengers', table_qry: 'SELECT * FROM Passengers'}, () => this.query_db(this.state.table_qry))
        break;
      case 'getRoutes':
        this.setState({ type: 'table', form_data: 'Routes', table_qry: 'SELECT * FROM Routes' }, () => this.query_db(this.state.table_qry))
        break;
      case 'getAddresses':
        this.setState({ type: 'table', form_data: 'Address', table_qry: 'SELECT * FROM Addresses' }, () => this.query_db(this.state.table_qry))
        break;

      // new
      case 'newAddress':
        this.setState({ type: 'address_form', form_data: 'Address', form_mode: 'new' })
        break;
      case 'newDriver':
        this.setState({ type: 'driver_form', form_data: 'Drivers', form_mode: 'new' })
        break;
      case 'newPassenger':
        this.setState({ type: 'passenger_form', form_data: 'Passengers', form_mode: 'new' })
        break;
      case 'newRoute':
        this.setState({ type: 'route_form', form_data: 'Routes', form_mode: 'new' })
        break;

        
        // edit form
      case 'edit_form':
        this.setState({ type: 'form', form_mode: 'edit', edit_id: evt.target.attributes.edit_id.value })
        break;
    }

    // set page history
    this.setState({
      page_history: page_history_arr
    })
  }

 
  async runDBFunction(str) {
    switch(str) {
      case 'build':
        await fetch(root_uri + '/build');
        break;
      case 'seed':
        fetch(root_uri + '/seed')
          .then(() => this.query_db('SELECT * FROM Person'));
        break;
      case 'destroy':
        fetch(root_uri + '/destroy')
          .then(() => this.query_db('SELECT * FROM Person'));
        break;
    }
  }  


  async query_db(qry) {
    let currentComponent = this;
    console.log(qry);

    // send query to server hosting db
    let resp = await fetch(root_uri + '/query', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
        'q': qry
      })
    }).then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        // console.log(JSON.stringify(myJson));
        currentComponent.setState({data: JSON.stringify(myJson)});
        return JSON.stringify(myJson);
      });

    return resp;
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title icon text-center" name='home' onClick={evt => this.navigate(evt)}>COSC 471 demo</h1>
        </header>
        <Modal modal_data={this.state.modal_data} navigate={this.navigate} close_modal={() => this.state.setModalContent()} />
        
        {/* debugging data */}
        {/* <div>type: {this.state.type} --- form data: {this.state.form_data} --- form_mode: {this.state.form_mode} --- edit_id: {this.state.edit_id}</div> */}

        {/* back button */}
        <button style={ this.state.type === 'home' ? {'visibility':'hidden'} : {'visibility':'visible'}} className="mybtn btn btn-primary btn-info" name='back' onClick={(evt) => this.navigate(evt)}>Back</button>
        
        <br /><br />
        <div className="grid-container">  
          <div className='gridTable'>
            <gProvider.Provider value={this.state}>
              <DynamicContent type={this.state.type} />
            </gProvider.Provider>
          </div>
        </div>
  

      </div>
    );
  }
}
export default App;