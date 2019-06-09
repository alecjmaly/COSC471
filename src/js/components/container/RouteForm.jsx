import React, {Component} from 'react';
import AddressForm from './AddressForm.jsx';


export default class RouteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: [],
      drivers: [],
      passengers: [],


      driver_id: '',
      driver_rating: '',
      passenger_id: '',
      passenger_rating: '',
      start_address_id: '',
      end_address_id: ''

    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRoute = this.deleteRoute.bind(this);
    this.validateData = this.validateData.bind(this);
    this.validateField = this.validateField.bind(this);
    
    this.getAddresses = this.getAddresses.bind(this);
    this.getDrivers = this.getDrivers.bind(this);
    this.getPassengers = this.getPassengers.bind(this);
  }

  async componentDidMount() {
    this.getAddresses();
    this.getPassengers();
    this.getDrivers();

    if (this.props.form_mode === 'edit') {
      console.log('getting edit data');

      // get route data
      let route = await this.props.query_db(`SELECT * FROM Route WHERE id = ${this.props.edit_id};`);
      route = JSON.parse(route)[0];
      console.log('route');
      console.log(route);


      
      this.setState({ 
        driver_id: route.driver_id,
        driver_rating: route.Driver_rating,
        passenger_id: route.passenger_id,
        passenger_rating: route.Passenger_rating,
        start_address_id: route.Start_address,
        end_address_id: route.End_address
       })
    }
  }
  


  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }


  async handleSubmit(evt) {
    evt.preventDefault();

    const validation = await this.validateData();
    if(!validation) 
      return;
      
    // create / update route
    if (this.props.form_mode === 'new') {
      this.props.query_db(`INSERT INTO Route(driver_id, passenger_id, Start_address, End_address, Driver_rating, Passenger_rating)
        VALUES (${this.state.driver_id}, ${this.state.passenger_id}, ${this.state.start_address_id}, ${this.state.end_address_id}, ${this.state.driver_rating}, ${this.state.passenger_rating})`);
    } else if (this.props.form_mode === 'edit') {
      await this.props.query_db(`UPDATE OR IGNORE Route
        SET driver_id=${this.state.driver_id}, passenger_id=${this.state.passenger_id}, Start_address=${this.state.start_address_id}, End_address=${this.state.end_address_id}, Driver_rating=${this.state.driver_rating}, Passenger_rating=${this.state.passenger_rating}
        WHERE id = ${this.props.edit_id}
        `);
      }
    // end create / update Person

    this.props.setModalContent('Yay!', 'Data was submitted successfully!', 'modal-success');
  }

  async deleteRoute(evt) {
    evt.persist();
    await this.props.query_db(`DELETE FROM Route WHERE id=${this.props.edit_id}`);
    this.props.setModalContent('Yay!', 'Route was successfully deleted!', 'modal-success');
    
    this.props.navigate(evt);
  }


  validateData() {
    // return true as long as all fields are not blank
    let validation_data = [];

    validation_data.push(
      this.validateField(this.state.driver_id, 
      (value) => { return value !== this.state.passenger_id },
      "Please ensure driver and passenger are different people.")
    )

    validation_data.push(
      this.validateField(this.state.start_address_id, 
      (value) => { return value !== this.state.end_address_id },
      "Please ensure start address and end address are different.")
    )

    validation_data.push(
      this.validateField(this.state.driver_id, 
      (value) => { return value > 0 },
      "Please fill out driver field.")
    )

    validation_data.push(
      this.validateField(this.state.driver_rating, 
      (value) => { return value === null || (value > 0 && value < 11) },
      "Driver rating must be between 1 and 10.")
    )

    validation_data.push(
      this.validateField(this.state.passenger_id, 
      (value) => { return value > 0 },
      "Please fill passenger field.")
    )

    validation_data.push(
      this.validateField(this.state.passenger_rating, 
      (value) => { return value === null || (value > 0 && value < 11) },
      "Passenger rating must be between 1 and 10.")
    )

    validation_data.push(
      this.validateField(this.state.start_address_id, 
      (value) => { return value > 0 },
      "Please fill out start address.")
    )

    validation_data.push(
      this.validateField(this.state.end_address_id, 
      (value) => { return value > 0 },
      "Please fill out end address.")
    )


    let errors = validation_data.filter(resp => {
      return resp.pass === false;
    })

    if (errors.length === 0) return true;

    let err_msg = ''
    errors.forEach(err => {
      err_msg += err.msg + '<br>'
    })
    
    this.props.setModalContent('ERROR! Data validation failed!', err_msg, 'modal-error');
    return false
  }
  
  validateField(value, callback_constraint, err_msg) {
    if (!callback_constraint(value)) 
      return { pass: false, msg: err_msg };
    return { pass: true }
  }



  async getAddresses(evt) {
    if (evt !== undefined) evt.preventDefault();
    await this.props.query_db("SELECT * FROM ADDRESSES")
      .then((resp) => this.setState({ addresses: JSON.parse(resp) }));
    //console.log(this.state.addresses)
  }

  async getDrivers(evt) {
    if (evt !== undefined) evt.preventDefault();
    await this.props.query_db("SELECT * FROM Drivers")
      .then((resp) => this.setState({ drivers: JSON.parse(resp) }));
    console.log(this.state.drivers)
  }

  async getPassengers(evt) {
    if (evt !== undefined) evt.preventDefault();
    await this.props.query_db("SELECT * FROM Passengers")
      .then((resp) => this.setState({ passengers: JSON.parse(resp) }));
    console.log(this.state.passengers)
  }
  

  render() {
    return (      
      <div>
        <p className="h4 mb-4 text-center">{this.props.form_mode === 'new' ? 'New Route' : 'Edit Route'}</p>
  
        <div className="route-form">

          {/* Driver */}
          <div className="gridCell">
            <h5 className='label col'>Driver</h5>
          </div>
          <div className='gridCell'>
            <select className='form-control' id='driver_id' onChange={(evt) => this.handleChange(evt)} onClick={() => this.getDrivers()} value={this.state.driver_id} >
              <option></option>
              {this.state.drivers.map(row => {
                return <option key={row.id} value={row.id}>{`${row['Display Name']}`}</option>
              })}
            </select> 
          </div>
          <div className='gridCell'>
            <div className='center-block'>
              <input type="number" id="driver_rating" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Passenger Rating" value={this.state.driver_rating} />
            </div>
          </div>

          {/* Passenger */}
          <div className="gridCell">
            <h5 className='label col'>Passenger</h5>
          </div>
          <div className='gridCell'>
            <select className='form-control' id='passenger_id' onChange={(evt) => this.handleChange(evt)} onClick={() => this.getPassengers()} value={this.state.passenger_id} >
              <option></option>
              {this.state.passengers.map(row => {
                return <option key={row.id} value={row.id}>{`${row['Display Name']}`}</option>
              })}
            </select> 
          </div>
          <div className='gridCell'>
            <div className='center-block'>
              <input type="number" id="passenger_rating" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Driver Rating" value={this.state.passenger_rating} />
            </div>
          </div>

          {/* Start Address */}
          <div className="gridCell">
              <h5>Start Address</h5>
          </div>
          <div className="gridCell">
            <select className='form-control' id='start_address_id' onChange={(evt) => this.handleChange(evt)} onClick={() => this.getAddresses()} value={this.state.start_address_id} >
              <option></option>
              {this.state.addresses.map(row => {
                return <option key={row.id} value={row.id}>{`${row.Street}  ${row.City}, ${row.State}  ${row.Zip}`}</option>
              })}
            </select>
          </div>
          <div className="gridCell"></div>


          {/* End Address */}
          <div className="gridCell">
              <h5>End Address</h5>
          </div>
          <div className="gridCell">
            <select className='form-control' id='end_address_id' onChange={(evt) => this.handleChange(evt)} onClick={() => this.getAddresses()} value={this.state.end_address_id} >
              <option></option>
              {this.state.addresses.map(row => {
                return <option key={row.id} value={row.id}>{`${row.Street}  ${row.City}, ${row.State}  ${row.Zip}`}</option>
              })}
            </select>
          </div>
          <div className="gridCell"></div>

        </div>

  
        <br />    
          <div className="row">
            <div className="col">
              <button className='btn btn-success btn-block' onClick={(evt) => this.handleSubmit(evt)}>{this.props.form_mode === 'new' ? 'Add Route' : 'Save Changes'}</button>
            </div>
            <div className="col">
              <button className="btn btn-danger btn-block" name='home' style={this.props.form_mode === 'edit' ? {'visibility': 'visible'} : {'visibility': 'hidden'}} onClick={(evt) => this.deleteRoute(evt)}>Delete Route</button> 
            </div>
          </div>
        
        <br /><br /><br />


        <AddressForm state={this.state} query_db={this.props.query_db} setModalContent={((title, msg, type) => this.props.setModalContent(title, msg, type))} />
          
      </div>
    )
  }
}
