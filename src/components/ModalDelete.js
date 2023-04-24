import React from "react";
import { Button, Icon, Modal, Progress } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
export default class ModalDelete extends React.Component {
  state = {
    open: false,
    percent: 0,
    done: 0,
    errors: 0,
    success: 0,
    deletePhase: "start",
    deleteAbort: false,
  };
  deleteAll = async () => {
    const length = Object.keys(this.props.checkMap).length;
    this.setState({ deletePhase: "pending" });
    for (const key in this.props.checkMap) {
      this.setState({ deletItem: key });
      if (this.state.deleteAbort) break;
      const elem = key.split("_");

      try {
        await this.props.deleteRow({
          year: parseInt(elem[1]),
          siren: parseInt(elem[0]),
        });
        console.log("Item deleted " + key);
        this.setState({ success: this.state.success + 1 });
        this.props.deleteFromMap(key);
      } catch (error) {
        console.error("ERROR Deleting item ", error);
        this.setState({ errors: this.state.errors + 1 });
      }
      await new Promise((resolve, reject) => {
        const inc = this.state.done + 1;
        this.setState(
          {
            done: inc,
            percent: Math.round((inc / length) * 100),
          },
          () => {
            return resolve();
          }
        );
      });
      //await this.waitTime(50);
    }
    this.setState({ deletePhase: "done" });
  };
  resetProgress = () => {
    this.setState({ percent: 0 });
  };
  closeModal = () => {
    this.setState({
      open: false,
      percent: 0,
      errors: 0,
      success: 0,
      deletItem: undefined,
      deletePhase: "start",
      deleteAbort: false,
    });
  };
  waitTime = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        return resolve();
      }, time);
    });
  };
  abortDelete() {
    this.setState({ deleteAbort: true });
  }
  getButton = (type) => {
    if (type === "delete")
      return (
        <Button
          basic
          icon
          labelPosition="left"
          disabled={this.state.percent === 100 ? true : false}
          onClick={() => this.deleteAll()}
        >
          <i className="times icon red"></i> Delete
        </Button>
      );
    else if (type === "close")
      return (
        <Button
          basic
          icon
          labelPosition="left"
          onClick={() => this.closeModal()}
        >
          <i className="times icon red"></i> Close
        </Button>
      );
    else
      return (
        <div>
          <Button
            basic
            icon
            labelPosition="left"
            onClick={() => this.abortDelete()}
          >
            <i className="times icon red"></i> Abort
          </Button>
        </div>
      );
  };
  getDeleteButtons() {
    if (this.state.deletePhase === "start") {
      return (
        <div>
          {this.getButton("delete")}
          {this.getButton("close")}
        </div>
      );
    } else if (this.state.deletePhase === "pending") {
      return <div>{this.getButton("abort")}</div>;
    } else {
      return <div>{this.getButton("close")}</div>;
    }
  }
  getDeletePhase = () => {
    const message = {};
    if (this.state.deletePhase === "start") {
      return <p>Delete {Object.keys(this.props.checkMap).length} Item(s) ?</p>;
    } else if (this.state.deletePhase === "pending") {
      return (
        <div>
          <label>
            Deleting Siren : {this.state.deletItem.split("_")[0]} Year:{" "}
            {this.state.deletItem.split("_")[1]}{" "}
          </label>
          <Progress percent={this.state.percent} progress />
        </div>
      );
    } else {
      if (this.state.errors) {
        message.negative = true;
        message.title = "Errors !";
      } else {
        message.title = "Success !";
        message.positive = true;
      }
      message.text =
        "Done , Errors : " +
        this.state.errors +
        " Success " +
        this.state.success;
      return <MessageSuccessError message={message}></MessageSuccessError>;
    }
  };
  render() {
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        trigger={
          <Button
            className="mini"
            disabled={Object.keys(this.props.checkMap).length ? false : true}
            icon
            labelPosition="left"
            basic
          >
            <Icon name="times" color="green" />
            {this.props.buttonName}
          </Button>
        }
      >
        <Modal.Header>
          <i className="building green icon"></i> Delete Entreprises
        </Modal.Header>
        <Modal.Content image>
          <Modal.Description>{this.getDeletePhase()}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>{this.getDeleteButtons()}</Modal.Actions>
      </Modal>
    );
  }
}
