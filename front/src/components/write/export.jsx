import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import store from 'store/configureStore';

export default class Export extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
  }

  getHTML(){
    let target = "export";
    if(this.props.target == "EruditXML"){
      target='exportErudit';
    }
    window.open('/api/v1/'+target+'/'+this.props.version,'_blank')
  }

  render() {
    return (
        <button className="button primaryButton" onClick={this.getHTML}>Export as {this.props.target}</button>
    );
  }
}