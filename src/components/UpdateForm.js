import React from "react";
import { Button, Form, Loader, Dimmer } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import app_env from "../AppEnv";

const nameRegex = /.*[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9-_]$/g;
export default class UpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: undefined,
      loading: false,
      ...props.item,
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleSubmit = () => {
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
    } else if (this.state.siren.toString().length !== 9) {
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    try {
      await fetch(app_env.url.API_URL + "/upd_entreprise", requestOptions);
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
            <label>Siren</label>
            <Form.Input
              required
              min="0"
              type="number"
              placeholder="Siren"
              name="siren"
              disabled
              value={this.state.siren}
            />
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
              disabled
            />
          </Form.Field>

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
            <Form.Input
              required
              placeholder="Sector"
              name="sector"
              value={this.state.sector}
              onChange={this.handleChange}
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
              value={this.state.ca}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Margin</label>
            <Form.Input
              required
              type="number"
              placeholder="Margin"
              name="margin"
              value={this.state.margin}
              onChange={this.handleChange}
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
              value={this.state.ebitda}
              onChange={this.handleChange}
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
              value={this.state.loss}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form.Field>
          <Button basic icon labelPosition="left" type="submit">
            <i className="cloud upload green icon"></i>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
