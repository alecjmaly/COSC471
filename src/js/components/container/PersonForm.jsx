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
            <label className='float-left'>First Name</label>
              <input type="first_name" id="first_name" className="form-control mb-4" onChange={(evt) => this.props.state.handleChange(evt)} placeholder='' value={this.props.state.first_name} />  
            </div>
            <div className="gridCell">
            <label className='float-left'>Last Name</label>
              <input type="last_name" id="last_name" className="form-control mb-4" onChange={(evt) => this.props.state.handleChange(evt)} placeholder='' value={this.props.state.last_name} />
            </div>
          </div>


          <div className="driver-form">
            <div className="gridCell">
              <label className='alignSelf-center'>
                Adddress (Complete form below for new address)
              </label>
            </div>
            <div className="gridCell">
              <select className='form-control alignSelf-center' id='address_id' onChange={(evt) => this.props.state.handleChange(evt)} onClick={() => this.pullAddresses()} value={this.props.state.address_id} >
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
