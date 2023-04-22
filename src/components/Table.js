import React, { Component } from "react";
import DTable from "./DataTableEntreprise";
import Modal from "./Modal";
import { Button, Icon, Dimmer, Loader, Segment, List } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import app_env from "../AppEnv";
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      Limit: 200,
      disabled: true,
    };
  }
  deleteRow = async (item) => {
    let input = prompt('Type "' + item.name + item.year + '" to delete item');
    if (input !== item.name + item.year) return;
    try {
      await this.deleteData(item);

      this.setState({
        message: {
          title: "Success !",
          text: "Entreprise " + item.name + " Deleted !",
          positive: true,
        },
      });
    } catch (error) {
      this.setState({
        message: {
          title: "Error !",
          text: error.message || error.stack || error,
          positive: true,
        },
      });
      return console.error(error);
    }
    const filteredData = this.state.data.filter(
      (i) =>
        i.siren.toString() + i.year.toString() !==
        item.siren.toString() + item.year.toString()
    );
    this.setState({ data: filteredData });
    return;
  };
  addRow(row) {
    this.setState({ data: { row, ...this.state.data } });
  }
  deleteData(item) {
    return new Promise(async (resolve, reject) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      };
      try {
        return resolve(
          await fetch(
            app_env.url.API_URL + "/delete_entreprise",
            requestOptions
          )
        );
      } catch (error) {
        return reject(error);
      }
    });
  }
  getData = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Limit: this.state.Limit || 10,
        ExclusiveStartKey: this.state.ExclusiveStartKey,
      }),
    };
    try {
      const response = await fetch(
        app_env.url.API_URL + "/scan_entreprises",
        requestOptions
      );
      const data = await response.json();
      this.setState({ data: [...this.state.data, ...data.Items] });
      if (data.LastEvaluatedKey)
        this.setState({ ExclusiveStartKey: data.LastEvaluatedKey });
      else this.setState({ ExclusiveStartKey: undefined });
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
  componentDidMount() {
    this.getData();
  }
  reloadTable = async () => {
    this.setState({ data: [], ExclusiveStartKey: undefined });
    this.getData();
  };
  render() {
    return (
      <div>
        <List>
          <List.Item>
            <List.Content>
              <Modal buttonName="Add entreprise" />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button
                basic
                icon
                labelPosition="left"
                disabled={!this.state.ExclusiveStartKey}
                onClick={this.getData}
              >
                <Icon name="cloud download" color="green" />
                More data
              </Button>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Button
                basic
                icon
                labelPosition="left"
                onClick={this.reloadTable}
              >
                <Icon name="refresh" color="green" />
                Refresh
              </Button>
            </List.Content>
          </List.Item>
        </List>

        <Segment basic>
          <Dimmer active={this.state.loading} inverted>
            <Loader />
          </Dimmer>
          <Segment basic>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Segment>
          <DTable
            columns={this.columns}
            data={this.state.data}
            deleteRow={this.deleteRow}
            gotoEdit={this.gotoEdit}
          />
        </Segment>
      </div>
    );
  }
}
export default Table;
