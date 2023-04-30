import React from "react";
import { Form, Loader, Dimmer, Button, Modal, Icon } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import SectorDropDown from "./SectorDropDown";
import { backendCall } from "../callFetch";
const nameRegex = /.*[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9-_]$/g;
export default class UpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      loading: false,
      deleted: false,
      confirmed: false,
      ...props.item,
      openConfirmation: false,
      confirmationSubtitle: "",
      check: "remove",
      value: "",
    };
  }
  delete = () => {
    this.setState({
      openConfirmation: true,
      confirmationSubtitle:
        "Type 'remove' to delete  : " +
        this.state.name +
        " of year " +
        this.state.year,
    });
  };

  confirmedDelete = async () => {
    this.setState({ openConfirmation: false, value: "", loading: true });
    try {
      await this.props.deleteRow({
        year: this.state.year,
        siren: this.state.siren,
      });
      return this.setState(
        {
          loading: false,
          deleted: true,
          message: {
            title: "Success !",
            text: "Item deleted",
            positive: true,
          },
        },
        () => {
          if (this.props.deleted) this.props.deleted();
        }
      );
    } catch (error) {
      console.error(error);
      return this.setState({
        message: {
          title: "Error !",
          text: error.message || error.code || error.stack || error,
          negative: true,
        },
      });
    }
  };
  handleSectorDropDownChange = (value) => {
    this.setState({ sector: value });
  };
  checkInput = (value) => {
    if (value === this.state.check) {
      this.setState({
        confirmed: true,
        value: value,
      });
    } else this.setState({ value: value, confirmed: false });
  };
  handleConfirmationInputChange = (e, { value }) => {
    this.checkInput(value);
  };
  handleConfirmationInputKeyUp = (e) => {
    if (e.keyCode === 8) {
      this.checkInput(e.target.value);
    }
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

    try {
      await backendCall("/upd_entreprise", data);

      this.setState({
        message: {
          title: "Success !",
          text: "Entreprise Updated",
          positive: true,
        },
      });
      this.props.updateItemInTable(data);
      return this.setState({ loading: false });
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

  conditionalForm = () => {
    if (!this.state.deleted) {
      return (
        <Form>
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
            <SectorDropDown
              value={this.state.sector}
              handleChange={this.handleSectorDropDownChange}
            ></SectorDropDown>
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
        </Form>
      );
    }
  };
  render() {
    return (
      <div>
        {this.conditionalForm()}
        <Modal
          onClose={() => this.setState({ openConfirmation: false })}
          open={this.state.openConfirmation}
          size="small"
        >
          <Modal.Header>Are you sure ?</Modal.Header>
          <Modal.Content>
            <p>{this.state.confirmationSubtitle}</p>
            <Form>
              <Form.Input
                onChange={this.handleConfirmationInputChange}
                onKeyUp={this.handleConfirmationInputKeyUp}
              ></Form.Input>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              labelPosition="left"
              basic
              icon="thumbs up"
              color="teal"
              content="Done"
              disabled={!this.state.confirmed}
              onClick={() => this.confirmedDelete()}
            />
            <Button
              className="ui medium top-padded search"
              basic
              icon
              labelPosition="left"
              onClick={() =>
                this.setState({ openConfirmation: false, value: "" })
              }
            >
              <Icon name="times" color="red" />
              Close
            </Button>
          </Modal.Actions>
        </Modal>
        <Form className="marginer">
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
