import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { backendCall } from "../callFetch";
const storage_name = "sector-options-dropdown";
class SectorDropDown extends Component {
  state = {
    options: [],
    sectors: [],
  };
  componentDidMount = () => {
    this.initialize();
  };
  initialize = async () => {
    let storage = JSON.parse(localStorage.getItem(storage_name));
    if (storage?.ts < new Date().getTime()) {
      localStorage.removeItem(storage_name);
      storage = null;
    }
    if (storage) return this.setState({ options: storage.options });
    const options = [];
    const sectors = {};
    try {
      const response = await this.getOptions();

      response.Items.forEach((item) => {
        if (!sectors[item.sector]) {
          sectors[item.sector] = true;
          options.unshift({
            key: item.sector,
            text: item.sector,
            value: item.sector,
          });
        }
      });
      options.sort((a, b) => {
        if (a.key > b.key) return 1;
        if (a.key < b.key) return -1;
        return 0;
      });
      return this.setState({ options: options, sectors: sectors }, () => {
        return localStorage.setItem(
          storage_name,
          JSON.stringify({
            options: options,
            ts: new Date().getTime() + 5 * 60 * 60 * 1000,
          })
        );
      });
    } catch (error) {
      return console.error(error);
    }
  };
  getOptions = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await backendCall("/scan_options", {});
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
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
        placeholder="Sector"
        search
        selection
        value={this.props.value}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    );
  }
}

export default SectorDropDown;
