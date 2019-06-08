import React, { Component } from "react";


import PersonForm from './PersonForm.jsx';
import AddressForm from './AddressForm.jsx';


class DriverForm extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      address_id: '',
      license_no: '',
      vin_no: '',
      license_plate_no: '',
      make: '',
      model: '',
      year: '',
      color: '',

      handleChange: (evt) => {
        //console.log(evt.target);
        this.setState({
          [event.target.id]: event.target.value
        })
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteDriver = this.deleteDriver.bind(this);
    this.validateData = this.validateData.bind(this);
    this.validateField = this.validateField.bind(this);
  }


  async componentDidMount() {
    if (this.props.form_mode === 'edit') {
      console.log('getting edit data');

      // get driver data
      let driver = await this.props.query_db(`SELECT * FROM Driver WHERE id = ${this.props.edit_id};`);
      driver = JSON.parse(driver)[0];
      console.log('driver');
      console.log(driver);

      let person_id = driver.id;
      let vehicle_VIN = driver.Vehicle_no;
      

      // get person data
      let person = await this.props.query_db(`SELECT * FROM Person WHERE id = ${person_id};`);
      person = JSON.parse(person)[0];
      console.log('person');
      console.log(person);

      let address_id = person.Address_id;

      // get address data from Person
      let address = await this.props.query_db(`SELECT * FROM Address WHERE id = ${address_id};`);
      address = JSON.parse(address)[0];
      console.log('address');
      console.log(address);

      // get vehicle data
      let vehicle = await this.props.query_db(`SELECT * FROM Vehicle WHERE VIN_no = ${vehicle_VIN};`);
      vehicle = JSON.parse(vehicle)[0];
      console.log('vehicle');
      console.log(vehicle);

      
      this.setState({ 
        first_name: person.First_name,
        last_name: person.Last_name,
        address_id: address.id,
        license_no: driver.License_no || '',
        vin_no: vehicle !== undefined ? vehicle.VIN_no : '',
        license_plate_no: vehicle !== undefined ? vehicle.License_Plate_No : '',
        make: vehicle !== undefined ? vehicle.Make : '',
        model: vehicle !== undefined ? vehicle.Model : '',
        year: vehicle !== undefined ? vehicle.Year : '',
        color: vehicle !== undefined ? vehicle.Color : '',
       });
    }
  }
  

  handleChange(evt) {
    console.log(evt.target);
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  
  async handleSubmit(evt) {
    evt.preventDefault();

    const validation = await this.validateData();
    if(!validation) 
      return;
      
    
    let data, resp;


    let person_id = this.props.edit_id;
    // create / update person
    if (this.props.form_mode === 'new') {
      // create person
      await this.props.query_db(`INSERT INTO Person(First_name, Last_name, Address_id) 
        VALUES ('${this.state.first_name}', '${this.state.last_name}', ${this.state.address_id})`);
      // ON DUPLICATE KEY UPDATE
      // First_name='${this.state.first_name}', Last_name='${this.state.last_name}', Address_id=${this.state.address_id};`);
      data = await this.props.query_db(`SELECT last_insert_rowid()`)
      person_id = JSON.parse(data)[0]['last_insert_rowid()'];
      console.log("ID = " + person_id);


    } else if (this.props.form_mode === 'edit') {
      await this.props.query_db(`UPDATE OR IGNORE Person
        SET First_name='${this.state.first_name}', Last_name='${this.state.last_name}', Address_id=${this.state.address_id}
        WHERE id = ${this.props.edit_id}
        `);
      }
    // end create / update Person

    
    // create / update Vehicle
    resp = await this.props.query_db(`SELECT * FROM Vehicle WHERE VIN_no = ${this.state.vin_no} AND License_Plate_No = '${this.state.license_plate_no}'`);

    // no vehicle matching VIN_no and License_Plate_no exist
    if (resp === '[]') {
      await this.props.query_db(`INSERT INTO Vehicle(VIN_no, License_Plate_No, Make, Model, Year, Color) 
        VALUES (${this.state.vin_no}, '${this.state.license_plate_no}', '${this.state.make}', '${this.state.model}', ${this.state.year}, '${this.state.color}')`);
    } else { 
      await this.props.query_db(`UPDATE Vehicle
        SET VIN_no=${this.state.vin_no}, License_Plate_No='${this.state.license_plate_no}', Make='${this.state.make}', Model='${this.state.model}', Year=${this.state.year}, Color='${this.state.color}'
        WHERE VIN_no=${this.state.vin_no}`);
    }
    // end create / update Vehicle
    
    
    
    // create driver relationship
    await this.props.query_db(`UPDATE OR IGNORE Driver
      SET id=${person_id}, License_no='${this.state.license_no}', Vehicle_no=${this.state.vin_no}
      WHERE id=${person_id}`);


    await this.props.query_db(`INSERT OR IGNORE INTO Driver(id, License_no, Vehicle_no) 
                              VALUES (${person_id}, '${this.state.license_no}', ${this.state.vin_no})`);
    // end create driver relationship
  
    
    this.props.setModalContent('Yay!', 'Data was submitted successfully!', 'modal-success');
    
  }

  async deleteDriver(evt) {
    evt.persist();
    await this.props.query_db(`DELETE FROM Driver WHERE id = ${this.props.edit_id}`);
    
    this.props.setModalContent('Yay!', 'Driver was successfully deleted!', 'modal-success');
    this.props.navigate(evt);
  }

  async validateData() {
    // return true as long as all fields are not blank

    let validation_data = [], resp;

    validation_data.push(
      this.validateField(this.state.first_name, 
      (value) => { return value.length > 0 },
      "Please fill out first name.")
    )

    validation_data.push(
      this.validateField(this.state.last_name, 
      (value) => { return value.length > 0 },
      "Please fill out last name.")
    )

    validation_data.push(
      this.validateField(this.state.address_id, 
      (value) => { return value.toString().length > 0 },
      "Please fill out street.")
    )

    validation_data.push(
      this.validateField(this.state.license_no, 
      (value) => { return value.toString().length > 0 },
      "Please fill out license number.")
    )

    validation_data.push(
      this.validateField(this.state.vin_no, 
      (value) => { return value.toString().length > 0 },
      "Please fill out VIN Number.")
    )

    validation_data.push(
      this.validateField(this.state.license_plate_no, 
      (value) => { return value.toString().length > 0 },
      "Please fill out license plate number.")
    )

    validation_data.push(
      this.validateField(this.state.make, 
      (value) => { return value.length > 0 },
      "Please fill out the make of the vehicle.")
    )

    validation_data.push(
      this.validateField(this.state.model, 
      (value) => { return value.length > 0 },
      "Please fill out the model of the vehicle.")
    )

    validation_data.push(
      this.validateField(this.state.year, 
      (value) => { return value.toString().length === 4 },
      "Please fill out valid year.")
    )

    validation_data.push(
      this.validateField(this.state.color, 
      (value) => { return value.length > 0 },
      "Please fill out the color.")
    )


    // check if drivers license number exists 
    if (this.props.form_mode === 'new') {
      resp = await this.props.query_db(`SELECT * FROM Driver WHERE License_no = '${this.state.license_no}'`);
      validation_data.push(
        this.validateField(resp, 
        (value) => { return value === '[]' },
        "That drivers license number already exists. Please choose another one.")
      )
    } else if (this.props.form_mode === 'edit') {
      resp = await this.props.query_db(`SELECT * FROM Driver WHERE id <> ${this.props.edit_id} AND License_no = '${this.state.license_no}'`);
      validation_data.push(
        this.validateField(resp, 
        (value) => { return value === '[]' },
        "That drivers license number already exists. Please choose another one.")
      )
    }
    


    // check if vehicle exists 
    resp = await this.props.query_db(`SELECT * FROM Vehicle WHERE VIN_no = ${this.state.vin_no} AND License_Plate_No = '${this.state.license_plate_no}'`);

    // no vehicle matching VIN_no and License_Plate_no exist
    if (resp === '[]') {
      // VIN && License plate number are same record, you are now updating
      // check if vin number exists
      resp = await this.props.query_db(`SELECT * FROM Vehicle WHERE VIN_no = ${this.state.vin_no}`);
      validation_data.push(
        this.validateField(resp, 
        (value) => { return value === '[]' },
        "That VIN number already exists. Please choose another one.")
      )

      // check if license plate number exists
      resp = await this.props.query_db(`SELECT * FROM Vehicle WHERE License_Plate_No = '${this.state.license_plate_no}'`);
      validation_data.push(
        this.validateField(resp, 
        (value) => { return value === '[]' },
        "That license plate number already exists. Please choose another one.")
      )

    }


    

    let errors = validation_data.filter(resp => {
      return resp.pass === false;
    })

    if (errors.length === 0) return true;

    // concatenate error message 
    let err_msg = ''
    errors.forEach(err => {
      err_msg += err.msg + '<br>'
    })
    
    this.props.setModalContent('ERROR! Data validation failed!', err_msg, 'modal-error');
    return false
  }
  

  // callback returns true = valid value
  validateField(value, callback_constraint, err_msg) {
    if (!callback_constraint(value)) 
      return { pass: false, msg: err_msg };
    return { pass: true }
  }

  render() {
    return (
      <div>
        <div id="article-form">
          <h1>{ this.props.form_mode === 'new' ? "Register New Driver" : "Edit Driver"}</h1>
          <PersonForm state={this.state} query_db={this.props.query_db} setModalContent={((title, msg, type) => this.props.setModalContent(title, msg, type))} />
          
          <h3 className='label label-defailt'>Vehicle Details</h3>
          <div className="car-details-form">
            <div className="gridCell">
              <input type="text" id="license_no" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Drivers License Number" value={this.state.license_no} />
            </div>
            <div className="gridCell">
              <input type="number" id="vin_no" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="VIN Number" value={this.state.vin_no} />
            </div>
            <div className="gridCell">
              <input type="text" id="license_plate_no" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="License Plate Number" value={this.state.license_plate_no} />
            </div>
            <div className="gridCell">
              <input type="text" id="make" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Make" value={this.state.make} />
            </div>
            <div className="gridCell">
              <input type="text" id="model" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Model" value={this.state.model} />
            </div>
            <div className="gridCell">
              <input type="number" id="year" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Year" value={this.state.year} />
            </div>
            <div className="gridCell">
              <input type="text" id="color" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Color" value={this.state.color} />
            </div>
            
            
          </div>
          
          <br />
          <div className="row">
            <div className="col">
              <button className="btn btn-success btn-block" onClick={(evt) => this.handleSubmit(evt)} type="submit">{this.props.form_mode === 'new' ? 'Create Driver' : 'Update Driver'}</button> 
            </div>
            <div className="col">
              <button className="btn btn-danger btn-block" name='home' style={this.props.form_mode === 'edit' ? {'visibility': 'visible'} : {'visibility': 'hidden'}} onClick={(evt) => this.deleteDriver(evt)} >Delete Driver</button> 
            </div>
          </div>
     
          
          <br /><br />
          <AddressForm state={this.state} form_data={this.props.form_data} query_db={this.props.query_db} setModalContent={((title, msg, type) => this.props.setModalContent(title, msg, type))} />
        </div><br /><br /><br />

      </div>
    );
  }
}
export default DriverForm;