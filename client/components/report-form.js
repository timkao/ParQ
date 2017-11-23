import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSpotOnServer } from '../store';


export class ReportForm extends Component {

  constructor(){
    super()
    this.state = {sizeValue: 'full-size car'}
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(ev) {
    ev.preventDefault();
    this.setState({sizeValue: ev.target.value})
  }

  handleCancel(ev) {
    ev.preventDefault();
    const {cancelReportSpot, reportspot} = this.props;
    cancelReportSpot(reportspot.id);
  }

  render() {
    const { handleChange, handleCancel } = this
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
            <select onChange={handleChange} id="size-choice" className="form-control" value={this.state.sizeValue}>
              <option value='full-size SUV'>Full-Size (SUV)</option>
              <option value='full-size car'>Full-Size (CAR)</option>
              <option value='mid-size car'>Mid-Size (CAR)</option>
              <option value='compact car'>Small-Size (COMPACT)</option>
            </select>
          </div>
          <div className="form-group">
            <button>Report</button>
            <button onClick={handleCancel} type="button">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    signs: state.signs,
    reportspot: state.reportspot
  }
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    cancelReportSpot(id) {
      dispatch(deleteSpotOnServer(id))
      .then(() => {
        ownProps.history.push('/home');
      })
    }
  }
}


export default connect(mapState, mapDispatch)(ReportForm);
