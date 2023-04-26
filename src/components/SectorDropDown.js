import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import * as TableData from "./table_data/table_data";

class SectorDropDown extends Component {
  constructor(props) {
    super(props);
    const options = [];
    const sectors = {};
    TableData.array.forEach((item) => {
      sectors[item.sector] = true;
    });
    for (const key in sectors) {
      if (sectors[key]) {
        options.push({
          key: key,
          text: key,
          value: key,
        });
      }
    }
    this.state = { options };
  }

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
