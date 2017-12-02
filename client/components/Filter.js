import React, { Component } from 'react';
import { connect } from 'react-redux';
import {DropdownButton, MenuItem, ButtonGroup, ToggleButtonGroup, ToggleButton, Button} from 'react-bootstrap';
import {setFilter} from '../store';

export class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: props.filter.distance,
      timeAvailable: props.filter.timeAvailable,
      size: props.filter.size,
      type: props.filter.type,
      openDropdown: false,
      dirty: false
    };
    this.handleClickClear = this.handleClickClear.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setDirtyState = this.setDirtyState.bind(this);
  }
  componentDidMount(){
    this.setDirtyState();
  }
  onChange(name, value){
    this.setState({[name]: value});
  }
  setDirtyState(){
    const {distance, timeAvailable, size, type} = this.props.filter;
    if (distance.length < 1 && timeAvailable.length < 1 && size.length < 1 && type.length < 1){
      this.setState({dirty: false});
    } else {
      this.setState({dirty: true});
    }
  }
  handleClickClear(name){
    this.setState({[name]: []});
  }
  handleClickReset(){
    this.setState({
      distance: [],
      timeAvailable: [],
      size: [],
      type: [],
      dirty: false
    }, this.handleFilter);
  }
  toggleDropdown(){
    const {filter} = this.props;
    const {distance, timeAvailable, size, type} = filter;
    this.setState({distance, timeAvailable, size, type, openDropdown: !this.state.openDropdown}, this.setDirtyState);
  }
  handleFilter(){
    const {distance, timeAvailable, size, type} = this.state;
    this.props.filterSpots({distance, timeAvailable, size, type});
    this.toggleDropdown();
  }
  render() {
    const { handleClickClear, onChange, handleClickReset, handleFilter, toggleDropdown } = this;
    const {distance, timeAvailable, size, type, openDropdown, dirty} = this.state;
    return (
      <DropdownButton bsSize="small" active={dirty} id="filter" rootCloseEvent="click" onToggle={toggleDropdown} open={openDropdown} title={<span className="glyphicon glyphicon-filter" />}>
        <MenuItem header>
          <h5>Distance <small onClick={() => handleClickClear('distance') }><a>clear</a></small></h5>
          <ToggleButtonGroup value={distance} onChange={(value) => onChange('distance', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value={1} className="btn btn-default">{'< 1 mi'}</ToggleButton>
            <ToggleButton value={3} className="btn btn-default">{'< 3 mi'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Time Available <small onClick={() => handleClickClear('timeAvailable') }><a>clear</a></small></h5>
          <ToggleButtonGroup value={timeAvailable} onChange={(value) => onChange('timeAvailable', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value={5} className="btn btn-default">{'< 5 min'}</ToggleButton>
            <ToggleButton value={15} className="btn btn-default">{'< 15 min'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Size <small onClick={() => handleClickClear('size') }><a>clear</a></small></h5>
          <ToggleButtonGroup value={size} onChange={(value) => onChange('size', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="compact car" className="btn btn-default">{'compact car'}</ToggleButton>
            <ToggleButton value="mid-size car" className="btn btn-default">{'mid-size car'}</ToggleButton>
            <ToggleButton value="full-size car" className="btn btn-default">{'full-size car'}</ToggleButton>
            <ToggleButton value="mid-size SUV" className="btn btn-default">{'mid-size SUV'}</ToggleButton>
            <ToggleButton value="full-size SUV" className="btn btn-default">{'full-size SUV'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Type <small onClick={() => handleClickClear('type') }><a>clear</a></small></h5>
          <ToggleButtonGroup value={type} onChange={(value) => onChange('type', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="Lot" className="btn btn-default">{'Lot'}</ToggleButton>
            <ToggleButton value="Street" className="btn btn-default">{'Street'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header>
          <ButtonGroup justified>
            <ButtonGroup><Button className="btn btn-danger btn-sm" onClick={handleClickReset}>Reset</Button></ButtonGroup>
            <ButtonGroup><Button className="btn btn-success btn-sm" onClick={handleFilter}>Filter</Button></ButtonGroup>
          </ButtonGroup>
        </MenuItem>
      </DropdownButton>
    );
  }
}

const mapState = ({filter}) => {
  return {
    filter
  };
};

const mapDispatch = (dispatch) => {
  return {
    filterSpots(filter) {
      dispatch(setFilter(filter));
    }
  };
};

export default connect(mapState, mapDispatch)(Filter);
