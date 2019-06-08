import React, {Component} from 'react';


export default class PersonForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: []
    }
  
    this.pullAddresses = this.pullAddresses.bind(this);
  }

  componentDidMount() {
    this.pullAddresses();
  }


  async pullAddresses(evt) {
    if (evt !== undefined) evt.preventDefault();
    await this.props.query_db("SELECT * FROM ADDRESSES")
      .then((resp) => this.setState({ addresses: JSON.parse(resp) }));
    //console.log(this.state.addresses)
  }
  

  render() {
    return (    
        <form className="p-5">
          <div className="driver-form">
            <div className="gridCell">
              <input type="first_name" id="first_name" className="form-control mb-4" onChange={(evt) => this.props.state.handleChange(evt)} placeholder="First Name" value={this.props.state.first_name} />  
            </div>
            <div className="gridCell">
              <input type="last_name" id="last_name" className="form-control mb-4" onChange={(evt) => this.props.state.handleChange(evt)} placeholder="Last Name" value={this.props.state.last_name} />
            </div>
          </div>


          <div className="driver-form">
            <div className="gridCell">

              <div className='row'>
                <span className='label col'>
                  Address (Fill out form below to add a new address)  
                </span>
                <div className='col'>
                  <button className='btn btn-sm btn-info' onClick={(evt)=>{this.pullAddresses(evt)}}>Click to update address list</button>
                </div>
              </div>

            </div>
            <div className="gridCell">
              <select className='form-control' id='address_id' onChange={(evt) => this.props.state.handleChange(evt)} onClick={() => this.pullAddresses()} value={this.props.state.address_id} >
                <option></option>
                {this.state.addresses.map(row => {
                  return <option key={row.id} value={row.id}>{`${row.Street}  ${row.City}, ${row.State}  ${row.Zip}`}</option>
                })}
              </select> 
            </div>
          </div>
        </form>
    )
  }
}
