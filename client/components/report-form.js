import React, { Component } from 'react';
import { connect } from 'react-redux';


export class ReportForm extends Component {

  constructor(){
    super()
    this.state = {sizeValue: 'medium'}
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log('Get into ReportForm: ', this.props.signs)
  }

  handleChange(ev) {
    ev.preventDefault();
    this.setState({sizeValue: ev.target.value})
  }

  render() {

    return (
      <div id="report-form">
        <div>
          <h3>Rules Around the Spot</h3>
          <ul className="list-group">
            <li className="list-group-item">test</li>
            <li className="list-group-item">test2</li>
          </ul>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="size-choice">Space Size</label>
            <select onChange={this.handleChange} id="size-choice" className="form-control" value={this.state.sizeValue}>
              <option value='large'>Large (SUV)</option>
              <option value='medium'>Medium (WAGON)</option>
              <option value='small'>Small (COMPACT)</option>
            </select>
          </div>
          <div className="form-group">
            <button>Report</button><button>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    signs: state.signs
  }
};

const mapDispatch = (dispatch) => {
  return {

  }
}


export default connect(mapState, mapDispatch)(ReportForm);
