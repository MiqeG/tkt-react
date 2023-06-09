import React from "react";
import { Form, Loader, Dimmer } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import SectorDropDown from "./SectorDropDown";
import { backendCall } from "../callFetch";
const model = {
  name: "",
  sector: "",
  year: 2022,
  siren: 0,
  ca: 0,
  margin: 0,
  ebitda: 0,
  loss: 0,
};
const nameRegex = /.*[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9-_]$/g;
export default class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: undefined,
      loading: false,
      ...model,
    };
  }

  handleSectorDropDownChange = (value) => {
    this.setState({ sector: value });
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleSubmit = () => {
    if (this.loading) return;
    const item = {
      name: this.state.name,
      sector: this.state.sector,
      year: parseInt(this.state.year),
      siren: parseInt(this.state.siren),
      ca: parseInt(this.state.ca),
      margin: parseInt(this.state.margin),
      ebitda: parseInt(this.state.ebitda),
      loss: parseInt(this.state.loss),
    };
    if (!item.name.match(nameRegex)) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Name doesnt match the schema : Alphanumerical and -",
          negative: true,
        },
      });
    } else if (!item.sector.match(nameRegex)) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Sector doesnt match the schema : Alphanumerical and -",
          negative: true,
        },
      });
    } else if (item.year > new Date().getFullYear()) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Year cannot be in the future",
          negative: true,
        },
      });
    } else if (item.year < 1800) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Year cannot be before 1800",
          negative: true,
        },
      });
    } else if (this.state.siren.length !== 9) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Bad siren number. Must be 9 numbers in length",
          negative: true,
        },
      });
    } else if (item.ca < 0) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Ca cannot be negative",
          negative: true,
        },
      });
    } else if (item.ebitda < 0) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Ebitda cannot be negative",
          negative: true,
        },
      });
    } else if (item.loss < 0) {
      return this.setState({
        message: {
          title: "Error !",
          text: "Loss cannot be negative",
          negative: true,
        },
      });
    }
    this.sendData(item);
  };
  sendData = async (data) => {
    this.setState({ loading: true });

    try {
      await backendCall("/put_entreprise", data);

      this.setState({
        message: {
          title: "Success !",
          text: "Entreprise Added",
          positive: true,
        },
      });
    } catch (error) {
      console.error(error);
      this.setState({
        message: {
          title: "Error !",
          text: error.message || error.stack || error,
          negative: true,
        },
      });
    }
    return this.setState({ loading: false });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Dimmer active={this.state.loading} inverted>
            <Loader />
          </Dimmer>
          <Form.Field>
            <label>Entreprise Name</label>
            <Form.Input
              required
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Sector</label>
            <SectorDropDown
              value={this.state.sector}
              handleChange={this.handleSectorDropDownChange}
            ></SectorDropDown>
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Form.Input
              required
              type="number"
              min="1800"
              max="2022"
              placeholder="Year"
              value={this.state.year}
              name="year"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Siren</label>
            <Form.Input
              required
              min="0"
              type="number"
              placeholder="Siren"
              name="siren"
              onChange={this.handleChange}
              value={this.state.siren}
            />
          </Form.Field>
          <Form.Field>
            <label>Ca</label>
            <Form.Input
              required
              min="0"
              type="number"
              placeholder="Ca"
              name="ca"
              onChange={this.handleChange}
              value={this.state.ca}
            />
          </Form.Field>
          <Form.Field>
            <label>Margin</label>
            <Form.Input
              required
              type="number"
              placeholder="Margin"
              name="margin"
              onChange={this.handleChange}
              value={this.state.margin}
            />
          </Form.Field>
          <Form.Field>
            <label>Ebitda</label>
            <Form.Input
              required
              min="0"
              type="number"
              placeholder="Ebitda"
              name="ebitda"
              onChange={this.handleChange}
              value={this.state.ebitda}
            />
          </Form.Field>
          <Form.Field>
            <label>Loss</label>
            <Form.Input
              required
              min="0"
              type="number"
              placeholder="Loss"
              name="loss"
              onChange={this.handleChange}
              value={this.state.loss}
            />
          </Form.Field>
          <Form.Field>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form.Field>
        </Form>
      </div>
    );
  }
}
