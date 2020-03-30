import React, { Component } from 'react';

import { ProgressBar } from "@blueprintjs/core";

import _ from "lodash";

import { Icon } from "react-icons-kit";
import { remove } from 'react-icons-kit/fa/remove';
import './assets/DraggableUploader.scss';
import axios from 'axios';
import Table from './Table';
//import Exporter from './ExportTable';

class DraggableUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedFiles: [],
      fd: null,
      confidence: '',
      diagnosis: '',
      dataObject: {
        Patient_ID: '',
        Confidence: '',
        Diagnosis: '',        
      },
    };

    this.onFileLoad = this.onFileLoad.bind(this)
    this.addLoadedFile = this.addLoadedFile.bind(this)
    this.removeLoadedFile = this.removeLoadedFile.bind(this)
    this.removeAllLoadedFile = this.removeAllLoadedFile.bind(this)
    this.updateLoadedFile = this.updateLoadedFile.bind(this)
    this.uploadFiles = this.uploadFiles.bind(this)
  }

  onFileLoad(e) {
    let file = null
    let fd = this.state.fd || new FormData()
    
    for (let i = 0; i < e.currentTarget.files.length; i++) {
      file = e.currentTarget.files[i]
      
      if (file) {
        let fileReader = new FileReader()
        fd.append('image', file, file.name)
    
        fileReader.onload = () => {
          const file = {
            data: fileReader.result,
            isUploading: false
          }
          //Add file
          this.addLoadedFile(file);
        }
    
        fileReader.onabort = () => {
          alert("Reading Aborted");
        }
    
        fileReader.onerror = () => {
          alert("Reading ERROR!");
        }
    
        fileReader.readAsDataURL(file);
      }

      if (i === e.currentTarget.files.length - 1) {
        this.setState({ fd })
      }
    }
  }

  addLoadedFile(file) {
    this.setState((prevState) => ({
      loadedFiles: [
        ...prevState.loadedFiles,
        file
      ]
    }));
  }

  removeLoadedFile(file) {
    //Remove file from the State
    this.setState((prevState) => {
      let loadedFiles = prevState.loadedFiles;
      let newLoadedFiles = _.filter(loadedFiles, (ldFile) => {
        return ldFile !== file;
      });
      return { loadedFiles: newLoadedFiles };
    });
  }

  removeAllLoadedFile() {
    this.setState({ loadedFiles: [] });
  }

  updateLoadedFile(oldFile, newFile) {
    this.setState((prevState) => {
      const loadedFiles = [ ...prevState.loadedFiles ]

      _.find(loadedFiles, (file, idx) => {
        if (file === oldFile) {
          loadedFiles[idx] = newFile
        }
      })

      return { loadedFiles };
    })

    return newFile;
  }

  uploadFiles() {
    const { loadedFiles, fd } = this.state;

    let n = loadedFiles.length

    if (n > 0) {
      axios.post('/api/upload', fd).then(res => {
        let filename = ''
        let newFile = null
  
        for (let i = 0; i < n; i++) {
          let file = loadedFiles.shift()
      
          newFile = this.updateLoadedFile(file, {
            ...file,
            isUploading: true
          })
  
          filename = res.data[i]
    
          axios.get('/api/predict?fileName=' + filename).then(res => {
            let diagnosis = res.data.diagnosis
            let confidence = res.data.confidence
    
            this.setState({
              dataObject: {
                Confidence: confidence,
                Diagnosis: diagnosis,
                Filename: res.config.url.split('=').pop(),
                Timestamp: Date(Date.now()),
              }
            })
    
            this.updateLoadedFile(newFile, {
              ...newFile,
              isUploading: false
            })
          })
  
          if (i === n - 1) {
            this.setState({ loadedFiles: [] })
            this.setState({ fd: null })
          }
        }
      }).catch(err => {
        console.log(err);
      })
    } else {
      alert('No loaded file!')
    }

  }

  render() {
    const { loadedFiles } = this.state;

    return (
      <div
        className="inner-container"
        style={ { display: "flex", flexDirection: "column" } }
      >

        {/* <div 
         className="sub-header"
         style={{'font-size': '3vw'}}>Covid-19 Detection System
        </div> */}

        <div 
          className="draggable-container"
          style={
            {
              width: '90vw',
              border: 'black dashed 2px',
              backgroundColor: 'white'
            }
          }
        >
          {/* TODO: fix the double submit issue */}
          <div style={ { zIndex: '2' } }>
            <input
              multiple
              type="file" id="file-browser-input" name="file-browser-input"
              ref={ input => this.fileInput = input }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              // onDrop={ e => this.onFileLoad(e) }
              onChange={ e => this.onFileLoad(e) }
            />
          </div>

          <div className="files-preview-container ip-scrollbar">
            {
              loadedFiles.map((file, idx) => {
                return (
                  <div className="file" key={ idx }>
                    <img src={ file.data } />

                    <div className="container">
                      <span className="progress-bar">
                        {
                          file.isUploading &&
                          <ProgressBar/>
                        }
                      </span>

                      <span
                        className="remove-btn"
                        onClick={ () => this.removeLoadedFile(file) }
                      >
                        <Icon icon={ remove } size={ 19 } />
                      </span>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div
            className="helper-text" style={ { color: 'black', zIndex: '0' } }
          >
            <br />
            Drag & Drop Chest X-Ray (PA) Image(s)
            <br /><br />
            or
          </div>

          <div className="file-browser-container">
            <button
              type="button" className="btn btn-primary"
              style={ { minWidth: '150px' } }
              onClick={ () => this.fileInput.click() }
            >
              Upload file(s)
            </button>
          </div>
        </div>

        <div>
          <button
            type="button" className="btn btn-primary i-btn"
            style={ { marginBottom: '1em', marginTop: '1.5em' } }
            onClick={ () => this.uploadFiles() }
          >
            Analyze X-Ray image(s)
          </button>
        </div>

        {
          this.state.dataObject.confidence !== '' &&
          this.state.dataObject.diagnosis !== '' &&
          <Table data={ this.state.dataObject }/>
        }
      </div>
    );
  }
}

export default DraggableUploader
