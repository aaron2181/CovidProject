import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import axios from 'axios';
// import ImagePreview from './components/ImagePreview'
import DraggableUploader from './components/DraggableUploader'
// import Dropzone from 'react-dropzone'
// import Table from './components/Table'
import NavBar from './components/NavBar'

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />      
        <DraggableUploader />
      </div>
    );
  }
}

export default App;
