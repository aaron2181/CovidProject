import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Patient_ID", field: "Patient_ID", sortable: true
            }, {
                headerName: "Confidence", field: "Confidence", sortable: true
            }, {
                headerName: "Diagnosis", field: "Diagnosis", sortable: true
            }],
            rowData: []
        }
    }

    componentWillReceiveProps(props) {
        if (props.data.Confidence != '' && props.data.Diagnosis != '' && this.props.data != this.state.rowData[this.state.rowData.length - 1])
            this.setState({
                rowData: [...this.state.rowData, props.data]
            })
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '500px',
                    width: '600px'
                }}
            >
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}>
                </AgGridReact>
            </div>
        );
    }
}

export default Table;