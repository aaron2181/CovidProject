import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Filename", field: "Filename", sortable: true },
        { headerName: "Confidence", field: "Confidence", sortable: true },
        { headerName: "Diagnosis", field: "Diagnosis", sortable: true },
        { headerName: "Timestamp", field: "Timestamp", sortable: true },
      ],
      rowData: []
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.data.Confidence !== '' && props.data.Diagnosis !== '' &&
      JSON.stringify(this.props.data) !=
      JSON.stringify(this.state.rowData[this.state.rowData.length - 1])
    ) {
      this.setState({ rowData: [ ...this.state.rowData, props.data ] })
    }
  }

  sorted = data => {
    return data.sort((a, b) => {
      let ta = new Date(a.Timestamp)
      let tb = new Date(b.Timestamp)

      return tb.getTime() - ta.getTime()
    })
  }

  render() {
    let rows = this.sorted(this.state.rowData)

    return (
      <div
        className="ag-theme-balham"
        style={ { height: '45vh', width: '500px', background: 'none' } }
      >
        {
          this.state.rowData.length > 0 &&
          <AgGridReact
            columnDefs={ this.state.columnDefs }
            rowData={ rows }>
          </AgGridReact>
        }
      </div>
    )
  }
}

export default Table
