import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import { AnchorButton, Intent } from '@blueprintjs/core';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Filename", field: "Filename", sortable: true },
        { headerName: "Confidence", field: "Confidence", sortable: true },
        { headerName: "Diagnosis", field: "Diagnosis", sortable: true },
        {
          headerName: "Timestamp",
          field: "Timestamp",
          sortable: true,
          sort: "desc" 
        },
      ],
      rowData: [],
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.data.Confidence !== '' && props.data.Diagnosis !== '' &&
      JSON.stringify(this.props.data) !==
      JSON.stringify(this.state.rowData[this.state.rowData.length - 1])
    ) {
      this.setState({ rowData: [ ...this.state.rowData, props.data ] })
    }
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={
          {
            height: '40vh',
            minHeight: '200px',
            width: '70vw'
          }
        }
      >
        {/* {
          this.state.rowData.length > 0 && */}
          <AgGridReact
            columnDefs={ this.state.columnDefs }
            rowData={ this.state.rowData }>
          </AgGridReact>
        {/* } */}
        {/* {
          this.state.rowData.length > 0 && */}
          <Exporter data={ this.state } />
        {/* } */}
      </div>
    )
  }
}

class Exporter extends Component {

  exportFun() {
    if (this.props.data.rowData.length > 0) {
      let json = this.props.data.rowData
      let fields = ["Filename", "Confidence", "Diagnosis", "Timestamp"]
      let replacer = (key, value) => { return value === null ? '' : value }
 
      let csv = json.map(row => {
        return fields.map(fieldName => {
          return JSON.stringify(row[fieldName], replacer)
        }).join(',')
      })

      // add header column
      csv.unshift(fields.join(','))
      csv = csv.join('\r\n');

      //Download the file as CSV
      let downloadLink = document.createElement("a");
      let blob = new Blob(["\ufeff", csv]);
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "CovidLungAnalysis.csv";  //Name the file here
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url)
    } else {
      alert("This table is empty");
    }
  }

  render(){
    return(
      // <AnchorButton 
      //   text="Export Table"
      //   className="i-btn"
      //   intent={ Intent.SUCCESS }
      //   onClick={ () => this.exportFun() }
      //   style={ { marginTop: '.5em' } }
      // />
      <button
        type="button" className="btn btn-primary i-btn"
        style={ { marginBottom: '2em', marginTop: '1.5em' } }
        onClick={ () => this.exportFun() }
      >
        Export Table
      </button>
    )
  }
}

export default Table
