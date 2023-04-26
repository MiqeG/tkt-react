import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import * as TableData from "./table_data/table_data";

const storage_name = "sector-dropdown";
class SectorDropDown extends Component {
  state = {
    options: [],
    sectors: [],
  };
  componentDidMount = () => {
    this.initialize();
  };
  initialize = () => {
    const storage = localStorage.getItem(storage_name);
    if (storage) return this.setState({ options: JSON.parse(storage) });
    const options = [];
    const sectors = {};
    TableData.array.forEach((item) => {
      if (!sectors[item.sector]) {
        sectors[item.sector] = true;
        options.push({
          key: item.sector,
          text: item.sector,
          value: item.sector,
        });
      }
    });
    this.setState({ options: options, sectors: sectors }, () => {
      return localStorage.setItem(storage_name, JSON.stringify(options));
    });
  };
  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      options: [{ text: value, value }, ...prevState.options],
    }));
  };

  handleChange = (e, { value }) => {
    this.props.handleChange(value);
  };

  render() {
    return (
      <Dropdown
        options={this.state.options}
        placeholder="Choose Sector"
        search
        selection
        allowAdditions
        value={this.props.value}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    );
  }
}

export default SectorDropDown;
