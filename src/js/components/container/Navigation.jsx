import React, { Component } from "react";



class Navigation extends Component {
  constructor() {
    super();
    
  }
  

  
  render() {
    return (
      <div>
        <h2>Database Functions</h2>
        <div className="grid-container">  
          <div className='gridCell'>
            <div className='center-block'>
              <button className="mybtn btn btn-primary btn-success" onClick={() => { this.props.runDBFunction('build'); this.props.setModalContent('Success!','Database has been created','modal-success') } }>Build DB</button>
            </div>
          </div>
          <div className='gridCell'>
            <div className='center-block'>
              <button className="mybtn btn btn-primary btn-info" onClick={() => { this.props.runDBFunction('seed'); this.props.setModalContent('Success!','Database has been seeded','modal-success')} }>Seed DB</button>
            </div>
          </div>
          <div className='gridCell'>
            <div className='center-block'>
              <button className="mybtn btn btn-primary btn-danger" onClick={() => { this.props.runDBFunction('destroy'); this.props.setModalContent('Success!','Database has been destroyed','modal-success') }}>Destroy DB</button>
            </div>
          </div>
        </div>
        <br /><br /><br />


        <div>
          <h2 className='text-center'>Frontend Data</h2>
          <div className="views-btns">
            <div className="gridCell">
              <div className='center-block'>
                <button className="mybtn btn btn-primary btn-info" name='getDrivers' onClick={(evt) => this.props.navigate(evt)}>Drivers</button>
              </div>
            </div>
            <div className="gridCell">
              <div className='center-block'>
                <button className="mybtn btn btn-primary btn-info" name='getPassengers' onClick={(evt) => this.props.navigate(evt)}>Passengers</button>
              </div>
            </div>
            <div className="gridCell">
              <div className='center-block'>
                <button className="mybtn btn btn-primary btn-info" name='getRoutes' onClick={(evt) => this.props.navigate(evt)}>Routes</button>
              </div>
            </div>
            <div className="gridCell">
              <div className='center-block'>
                <button className="mybtn btn btn-primary btn-info" name='getAddresses' onClick={(evt) => this.props.navigate(evt)}>Addresses</button>
              </div>
            </div>
          </div>
          <br /><br /><br />

          <div>
            <h2 className='text-center'>Backend Data</h2>
              <div className="grid-container">
              <div className="gridCell">
                <div className='center-block'>
                  <button className="mybtn btn btn-primary btn-info" name='getPeople' onClick={(evt) => this.props.navigate(evt)}>People</button>
                </div>
              </div>
              <div className="gridCell">
                <div className='center-block'>
                  <button className="mybtn btn btn-primary btn-info" name='getCreditCards' onClick={(evt) => this.props.navigate(evt)}>Credit Cards</button>
                </div>
              </div>
              <div className="gridCell">
                <div className='center-block'>
                  <button className="mybtn btn btn-primary btn-info" name='getVehicles' onClick={(evt) => this.props.navigate(evt)}>Vehicles</button>
                </div>
              </div>
            </div>
          </div>

          <br /><br />

        </div>
      </div>
    );
  }
}
export default Navigation;