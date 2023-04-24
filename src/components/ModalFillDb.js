import React from "react";
import { Button, Icon, Modal, Progress } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import * as TableData from "./table_data/table_data";

export default class MofalOfFill extends React.Component {
  state = {
    open: false,
    percent: 0,
    done: 0,
    errors: 0,
    success: 0,
    fillPhase: "start",
    fillAbort: false,
    items: {},
  };
  parseTableDataItem = (item, elem) => {
    const Item = {
      name: item.name,
      sector: item.sector,
      siren: item.siren,
    };
    Item.ca = elem.ca;
    Item.year = elem.year;
    Item.margin = elem.margin;
    Item.loss = elem.loss;
    Item.ebitda = elem.ebitda;
    return Item;
  };
  parseTableData = () => {
    const data = TableData.array;
    const items = [];
    data.forEach((item) => {
      item.results.forEach((elem) => {
        items.push(this.parseTableDataItem(item, elem));
      });
    });
    return items;
  };
  fillAll = async () => {
    const items = this.state.items;
    const length = items.length || 0;
    this.setState({ fillPhase: "pending" });
    this.props.reset();
    for (const key in items) {
      const elem = items[key];
      this.setState({ fillItem: elem });
      if (this.state.fillAbort) break;
      try {
        await this.props.addRow(elem);
        console.log(
          "Item filled " +
            elem.name +
            " year " +
            elem.year +
            " siren " +
            elem.siren
        );
        this.setState({ success: this.state.success + 1 });
      } catch (error) {
        console.error("ERROR Filling item ", error);
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
    this.setState({ fillPhase: "done" });
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
      fillItem: undefined,
      fillPhase: "start",
      fillAbort: false,
    });
    this.props.reloadTable();
  };
  waitTime = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        return resolve();
      }, time);
    });
  };
  abortFill() {
    this.setState({ fillAbort: true });
  }
  getButton = (type) => {
    if (type === "fill")
      return (
        <Button
          basic
          icon
          labelPosition="left"
          disabled={this.state.percent === 100 ? true : false}
          onClick={() => this.fillAll()}
        >
          <i className="times icon red"></i> Fill
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
            onClick={() => this.abortFill()}
          >
            <i className="times icon red"></i> Abort
          </Button>
        </div>
      );
  };
  getFillButtons() {
    if (this.state.fillPhase === "start") {
      return (
        <div>
          {this.getButton("fill")}
          {this.getButton("close")}
        </div>
      );
    } else if (this.state.fillPhase === "pending") {
      return <div>{this.getButton("abort")}</div>;
    } else {
      return <div>{this.getButton("close")}</div>;
    }
  }
  getFillPhase = () => {
    const message = {};
    if (this.state.fillPhase === "start") {
      return <p>Fill {this.state.items.length} Item(s) ?</p>;
    } else if (this.state.fillPhase === "pending") {
      return (
        <div>
          <label>
            Filling Siren : {this.state.fillItem.siren} Year:
            {this.state.fillItem.year}
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
  componentDidMount() {
    const items = this.parseTableData();
    this.setState({ items: items });
  }
  render() {
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        trigger={
          <Button
            className="mini"
            disabled={this.state.items.length ? false : true}
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
          <i className="building green icon"></i> Fill Entreprises
        </Modal.Header>
        <Modal.Content image>
          <Modal.Description>{this.getFillPhase()}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>{this.getFillButtons()}</Modal.Actions>
      </Modal>
    );
  }
}
