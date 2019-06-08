import React, {Component} from 'react';


export default class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: [],

      street_no: '',
      street: '',
      city: '',
      state: '',
      zip: ''
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateData = this.validateData.bind(this);
    this.validateField = this.validateField.bind(this);
    
  }

  
  async componentDidMount() {
    if (this.props.form_mode === 'edit' && this.props.form_data === 'Address') {
      console.log('getting edit data');

      // get address data from Person
      let address = await this.props.query_db(`SELECT * FROM Address WHERE id = ${this.props.edit_id};`);
      address = JSON.parse(address)[0];
      console.log('address');
      console.log(address);

      
      this.setState({ 
        street_no: address.Street_no,
        street: address.Street,
        city: address.City,
        state: address.State,
        zip: address.Zip
       })
    }
  }
  

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  
  async handleSubmit(evt) {
    evt.preventDefault();

    // exit function if form data is not valid
    const validation = await this.validateData();
    if (!validation)
      return;

    if (this.props.form_mode === 'new' || this.props.form_data !== 'Address') {
      console.log("NEW ITEM");
      this.props.query_db(`INSERT INTO Address(Street_no, Street, City, State, Zip) VALUES 
        (${this.state.street_no}, '${this.state.street}', '${this.state.city}', '${this.state.state}', ${this.state.zip})`);
    } else {
      console.log("EDIT ITEM");
      this.props.query_db(`UPDATE Address
        SET Street_no=${this.state.street_no}, Street='${this.state.street}', City='${this.state.city}', State='${this.state.state}', Zip=${this.state.zip} 
        WHERE id = ${this.props.edit_id}`);
    }
     
    this.props.setModalContent('Yay!', 'Data was submitted successfully!', 'modal-success'); 
  }

  validateData() {
    // return true as long as all fields pass validation
    let validation_data = [];


    validation_data.push(
      this.validateField(this.state.street_no, 
      (value) => { return value.toString().length > 0 && !isNaN(value)  },
      "Please fill out street number.")
    )

    validation_data.push(
      this.validateField(this.state.street, 
      (value) => { return value.length > 0 },
      "Please fill out street.")
    )

    validation_data.push(
      this.validateField(this.state.city, 
      (value) => { return value.length > 0 },
      "Please fill out city.")
    )

    validation_data.push(
      this.validateField(this.state.state, 
      (value) => { return value.length > 0 },
      "Please fill out state.")
    )

    validation_data.push(
      this.validateField(this.state.zip, 
      (value) => { return value.toString().length > 0 && value.toString().length < 8 },
      "Please fill out zip (0 < length < 8).")
    )


    // collect errors
    let errors = validation_data.filter(resp => {
      return resp.pass === false;
    })

    // return if there are no errors
    if (errors.length === 0) return true;

    // create error message for modal
    let err_msg = ''
    errors.forEach(err => {
      err_msg += err.msg + '<br>'
    })
    
    // display modal and return validation failure
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
        <p className="h4 mb-4 text-center">{this.props.form_mode === 'new' || this.props.form_data !== 'Address' ? 'New Address' : 'Edit Address'}</p>
        <div className="driver-form">
          <div className="gridCell">
            <input type="number" id="street_no" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Street Number" value={this.state.street_no} />  
          </div>
          <div className="gridCell">
            <input type="text" id="street" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Street" value={this.state.street} />
          </div>
          <div className="gridCell">
            <input type="text" id="city" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="City" value={this.state.city} />
          </div>
          <div className="gridCell">
            <input type="text" id="state" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="State" value={this.state.state} />
          </div>
          <div className="gridCell">
            <input type="number" id="zip" className="form-control mb-4" onChange={(evt) => this.handleChange(evt)} placeholder="Zip" value={this.state.zip} />
          </div>
        
          <button className='btn btn-info btn-block' onClick={(evt) => this.handleSubmit(evt)}>
            {this.props.form_mode === 'new' || this.props.form_data !== 'Address' ? 'Add Address' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }
}
