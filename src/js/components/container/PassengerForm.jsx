import React, { Component } from "react";

import PersonForm from './PersonForm.jsx';
import AddressForm from './AddressForm.jsx';



class PassengerForm extends Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      last_name: '',
      address_id: '',
      credit_card_no: '',
      exp_mo: '',
      exp_year: '',

      handleChange: (evt) => {
        console.log(evt.target);
        this.setState({
          [event.target.id]: event.target.value
        })
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deletePassenger = this.deletePassenger.bind(this);
    this.validateData = this.validateData.bind(this);
    this.validateField = this.validateField.bind(this);
  }
  


  async componentDidMount() {
    if (this.props.form_mode === 'edit') {
      console.log('getting edit data');

      // get driver data
      let passenger = await this.props.query_db(`SELECT * FROM Passenger WHERE id = ${this.props.edit_id};`);
      passenger = JSON.parse(passenger)[0];
      console.log('passenger');
      console.log(passenger);

      let person_id = passenger.id;
      let credit_card_id = passenger.credit_card_id;

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
      let credit_card = await this.props.query_db(`SELECT * FROM Credit_Card WHERE id = ${credit_card_id};`);
      credit_card = JSON.parse(credit_card)[0];
      console.log('credit_card');
      console.log(credit_card);

      
      this.setState({ 
        first_name: person.First_name,
        last_name: person.Last_name,
        address_id: address.id,
        credit_card_no: credit_card !== undefined ? credit_card.Credit_card_num : '',
        exp_mo: credit_card !== undefined ? ('0'+credit_card.Credit_card_expMon).slice(-2) : '',
        exp_year: credit_card !== undefined ? credit_card.Credit_card_expYear : '',
       })
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
      
    
    let person_id = this.props.edit_id,
        data, credit_card_id;


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
        WHERE id = ${person_id}
      `);
    }
    // end create / update Person

    // create / update credit card
    if (this.props.form_mode === 'new' || credit_card_id === undefined) {
      await this.props.query_db(`INSERT INTO Credit_Card(Credit_card_num, Credit_card_expMon, Credit_card_expYear) 
        VALUES (${this.state.credit_card_no}, ${this.state.exp_mo}, ${this.state.exp_year})`);
      // get inserted card's id
      data = await this.props.query_db(`SELECT last_insert_rowid()`);
      credit_card_id = JSON.parse(data)[0]['last_insert_rowid()'];
      console.log("credit card ID = " + credit_card_id);

    } else if (this.props.form_mode === 'edit') {
      // get credit card id to update
      let credit_card = await this.props.query_db(`SELECT * FROM Passenger WHERE id = ${person_id}`)
      credit_card_id = JSON.parse(credit_card)[0]['credit_card_id'];

      // update credit card id
      await this.props.query_db(`UPDATE OR IGNORE Credit_Card
        SET Credit_card_num='${this.state.credit_card_no}', Credit_card_expMon='${this.state.exp_mo}', Credit_card_expYear=${this.state.exp_year}
        WHERE id = ${credit_card_id}
      `);
    }
    // end create / update credit card

    

    // create / update passenger relationship
    if (this.props.form_mode === 'new') {
      await this.props.query_db(`INSERT INTO Passenger(id, credit_card_id) 
        VALUES (${person_id}, ${credit_card_id})`);
    } else if (this.props.form_mode === 'edit') {
      await this.props.query_db(`UPDATE OR IGNORE Passenger
        SET credit_card_id='${credit_card_id}'
        WHERE id=${person_id}`);
    }
    // end create / update passenger relationship
    

    this.props.setModalContent('Yay!', 'Data was submitted successfully!', 'modal-success');
  }


  async deletePassenger(evt) {
    evt.persist();
    await this.props.query_db(`DELETE FROM Passenger WHERE id = ${this.props.edit_id}`);
    
    this.props.setModalContent('Yay!', 'Passenger was successfully deleted!', 'modal-success');
    this.props.navigate(evt);
  }


  validateData() {
    // return true as long as all fields are not blank

    let validation_data = [];

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
      this.validateField(this.state.credit_card_no, 
      (value) => { return value.toString().length === 15 },
      "Credit Card Number must be 15 numbers long - 12 digit card number + 3 digit security code .")
    )

    validation_data.push(
      this.validateField(this.state.exp_mo, 
      (value) => { return value.toString().length > 0 },
      "Please fill out license expiration month.")
    )

    validation_data.push(
      this.validateField(this.state.exp_year, 
      (value) => { return value.toString().length > 0 },
      "Please fill out license expiration year.")
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

  render() {
    return (
      <div>
        <div id="article-form">
          <h1>{this.props.form_mode === 'new' ? 'Register New Passenger' : 'Edit Passenger'}</h1>
          <PersonForm state={this.state} query_db={this.props.query_db} setModalContent={((title, msg, type) => this.props.setModalContent(title, msg, type))} />
          

          <div className='creditcard-form'>
            <div className='gridCell'>  
              <label className='float-left'>Credit Card Number</label>
              <input type="credit_card_no" id="credit_card_no" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder='12 digit card number + 3 digit security code' value={this.state.credit_card_no} />
            </div>
            <div className='gridCell'>
              <label className='float-left'>Expiration Month</label>
              <select type="exp_mo" id="exp_mo" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder='' value={this.state.exp_mo}>
                <option></option>
                <option value='01'>Jan</option>
                <option value='02'>Feb</option>
                <option value='03'>Mar</option>
                <option value='04'>Apr</option>
                <option value='05'>May</option>
                <option value='06'>Jun</option>
                <option value='07'>Jul</option>
                <option value='08'>Aug</option>
                <option value='09'>Sep</option>
                <option value='10'>Oct</option>
                <option value='11'>Nov</option>
                <option value='12'>Dec</option>
              </select>
            </div>
            <div className='gridCell'>
              <label className='float-left'>Expiration Year</label>
              <select type="exp_year" id="exp_year" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder='' value={this.state.exp_year}>
                <option></option>
                <option value='2019'>2019</option>
                <option value='2020'>2020</option>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
                <option value='2023'>2023</option>
                <option value='2024'>2024</option>
                <option value='2025'>2025</option>
              </select>
            
            </div>
          </div>

          <br />    
          <div className="row">
            <div className="col">
              <button className="btn btn-success btn-block" onClick={(evt) => this.handleSubmit(evt)} type="submit">{this.props.form_mode === 'new' ? 'Create Passenger' : 'Update Passenger'}</button> 
            </div>
            <div className="col">
              <button className="btn btn-danger btn-block" name='home' style={this.props.form_mode === 'edit' ? {'visibility': 'visible'} : {'visibility': 'hidden'}} onClick={(evt) => this.deletePassenger(evt)}>Delete Passenger</button> 
            </div>
          </div>
          
          <br /><br />
          <AddressForm state={this.state} query_db={this.props.query_db} setModalContent={((title, msg, type) => this.props.setModalContent(title, msg, type))} />
        </div><br /><br /><br />

      </div>
    );
  }
}
export default PassengerForm;