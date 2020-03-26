import React, { Component } from 'react'
import axios from 'axios';

class UploadFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            diagnosis: null,
            confidence: null,
        }
    }

    selectFileHandler = e => {
        let files = e.target.files[0];
        this.setState({
            selectedFile: files,
        })
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
        axios.post('/upload', fd, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
            }
        })
            .then(res => {
                console.log(res);
                let filename = res.data;
                axios.get('localhost:5000/predict?fileName=' + filename)
                    .then(res => {
                        console.log('hi');
                        console.log(res);
                        let { confidence, diagnosis } = res.data
                        this.setState({
                            confidence: confidence,
                            diagnosis: diagnosis,
                        })
                    })
            })
    }

    render() {
        return (
            <div className="Upload">
                <input type="file" onChange={this.selectFileHandler} />
                <button onClick={this.fileUploadHandler}>Upload</button>
                {this.state.diagnosis != null && this.state.diagnosis}
                {this.state.confidence != null && this.state.confidence}
            </div>
        )
    }
}

export default UploadFile