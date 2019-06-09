import React, {Component} from 'react';



export default class HTMLTable extends Component {
  constructor(props) {
    super(props)
    this.tableRef = React.createRef();

    this.state = {
      btn_text: '',
      btn_name: '',
      btn_visibility: 'hidden',
      can_edit: false
    }

    this.buildHTML = this.buildHTML.bind(this);
  }

  componentDidUpdate() {
    this.buildHTML();
  }


  componentDidMount() {

    let btn_text, btn_name, btn_visibility='visible', can_edit=false;

    // set button properties based on current view
    switch (this.props.name) {
      case 'Drivers':
        btn_text = 'New Driver';
        btn_name = 'newDriver';
        can_edit = true;
      break;
      case 'Passengers':
        btn_text = 'New Passenger';
        btn_name = 'newPassenger';
        can_edit = true;
      break;
      case 'Routes':
        btn_text = 'New Route';
        btn_name = 'newRoute';
        can_edit = false;
      break;
      case 'Address':
        btn_text = 'New Address';
        btn_name = 'newAddress';
        can_edit = true;
      break;
      default: 
        btn_visibility = 'hidden';
        can_edit = false;
    }

    this.setState({
      btn_text: btn_text,
      btn_name: btn_name,
      btn_visibility: btn_visibility,
      can_edit: can_edit
    }, () => this.buildHTML())

    
  }

  buildHTML() {
    // sets if edit button available if new button is displayed

    // reset table
    this.refs.tableRef.innerHTML = '';

    // exit if no data to display
    let data = JSON.parse(this.props.data);
    if (data.length === 0)
      return;


    // build headers
    let keys = Object.keys(data[0]);

    let table_content = document.createElement('div');
    let table_row, table_cell;

    table_row = document.createElement('tr');

    if (this.state.can_edit) {
      // edit row
      table_cell = document.createElement('th');
      table_cell.innerText = 'Edit';
      table_row.appendChild(table_cell);
    }

    Array.from(keys).map(key => {
      table_cell = document.createElement('th');
      table_cell.innerText = key.toString();
      table_row.appendChild(table_cell);
    });


    table_content.appendChild(table_row);
    // end build headers



    // build table body
    Array.from(data).map(row => {
      table_row = document.createElement('tr');
      
      // edit button
      if (this.state.can_edit) {
        table_cell = document.createElement('td');

        let button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-info');
        button.innerText = 'EDIT';
        button.setAttribute('name', 'edit_form');
        button.setAttribute('edit_id', row['id']);
        button.onclick = (evt) => this.props.navigate(evt);
        table_cell.appendChild(button);

        table_row.appendChild(table_cell);
      }

    

      
      keys.map(key => {
        

        if (this.props.name === 'People' && (key === 'isDriver' || key === 'isPassenger')) {
          table_cell = document.createElement('td');
    
          let button = document.createElement('button');
          let qry;
          // isDriver button
          if ( row[key] === 0) {
            // not driver
            table_cell.innerText = 'FALSE: ';
            button.innerText = key === 'isDriver' ? 'Make Driver' : 'Make Passenger';
            button.classList.add('btn', 'btn-outline-success', 'btn-sm');

            if (key === 'isDriver')
              qry = `INSERT INTO Driver(id) VALUES(${row['id']})` 
            else
              qry = `INSERT INTO Passenger(id) VALUES(${row['id']})`;
          } else {
            table_cell.innerText = 'TRUE: ';
            button.innerText = key === 'isDriver' ? 'Remove Driver' : 'Remove Passenger';
            button.classList.add('btn', 'btn-outline-danger', 'btn-sm');

            if (key === 'isDriver') 
              qry = `DELETE FROM Driver WHERE id=${row['id']}` 
            else
              qry = `DELETE FROM Passenger WHERE id=${row['id']}`
          }
    
          button.onclick = (evt) => {
            this.props.query_db(qry);
            this.props.query_db('SELECT * FROM People');
          }
          table_cell.appendChild(button);
    
          table_row.appendChild(table_cell);
        } else {
          // normal data
          table_cell = document.createElement('td');
          table_cell.innerText = row[key];
          table_row.appendChild(table_cell);
        }
      });



      table_content.appendChild(table_row);
    });
    
    this.refs.tableRef.appendChild(table_content);
  }



  render() {
    return (
      <div className="comptext">
        <div className='grid-table-header'>
          <div className='gridTable'>
            <h2>{this.props.name}</h2>
          </div>
          <div className="gridCell" style={{'textAlign': 'right'}}>
            <div className='center-block'>
              <button className='mybtn btn btn-primary btn-success' style={{'visibility': this.state.btn_visibility}} name={this.state.btn_name} onClick={(evt) => this.props.navigate(evt)}>{this.state.btn_text}</button>
            </div>
          </div>
        </div>
        <table className='myTable' ref='tableRef'></table>
      </div>
    )
  }
}

