import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AnchorButton } from '@blueprintjs/core';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Filename", field: "Filename", sortable: true },
        { headerName: "Confidence", field: "Confidence", sortable: true },
        { headerName: "Diagnosis", field: "Diagnosis", sortable: true }
      ],
      rowData: []
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.data.Confidence != '' && props.data.Diagnosis != '' && this.props.data != this.state.rowData[this.state.rowData.length - 1]
    ) {
      this.setState({ rowData: [...this.state.rowData, props.data] })
    }
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{ height: '40vh', width: '605px', background: 'none' } }
      >
        {this.state.rowData.length > 0 &&
          <AgGridReact
            columnDefs={ this.state.columnDefs }
            rowData={ this.state.rowData }>
          </AgGridReact>
        }
        {
          this.state.rowData.length > 0 &&
          <Exporter data={this.state}/>
        }
      </div>
    )
  }
}

class Exporter extends Component {

  exportFun(){
      if(this.props.data.rowData.length > 0) {
          var json = this.props.data.rowData
          var fields = ["Filename", "Confidence", "Diagnosis"]
          var replacer = function(key, value) { return value === null ? '' : value } 
          var csv = json.map(function(row){
            return fields.map(function(fieldName){
              return JSON.stringify(row[fieldName], replacer)
            }).join(',')
          })
          csv.unshift(fields.join(',')) // add header column
          csv = csv.join('\r\n');

          //Download the file as CSV
          var downloadLink = document.createElement("a");
          var blob = new Blob(["\ufeff", csv]);
          var url = URL.createObjectURL(blob);
          downloadLink.href = url;
          downloadLink.download = "CovidLungAnalysis.csv";  //Name the file here
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      } else {
          alert("This table is empty");
      }
  }

  render(){
      return(
          <AnchorButton 
          text="Export Table" 
          onClick={() => this.exportFun()}
          style={ { marginBottom: '.5em', width:'250px', height: '2em' } }
          />
      )
  }
}

export default Table
