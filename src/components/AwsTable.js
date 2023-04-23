import React, { Component } from "react";
import MyTable from "./MyTable";
import Modal from "./Modal";
import {
  Button,
  Icon,
  Dimmer,
  Loader,
  Segment,
  Form,
  Dropdown,
  Input,
} from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import app_env from "../AppEnv";
const limitOptions = [
  {
    key: "500",
    text: "500",
    value: "500",
  },
  {
    key: "1000",
    text: "1000",
    value: "1000",
  },
  {
    key: "2000",
    text: "2000",
    value: "2000",
  },
  {
    key: "10000",
    text: "10K",
    value: "10000",
  },
];
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      sorters: {},
      Limit: 500,
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
  sortByName = (name, noToggle) => {
    let items = [...this.state.data];
    const sorters = {
      [name]:
        this.state.sorters[name] !== undefined
          ? this.state.sorters[name]
          : true,
    };
    if (!noToggle) {
      sorters[name] = !sorters[name];
      this.setState({ sorters: sorters });
    }
    if (items.length) {
      if (name === "name" || name === "sector") {
        items.sort(function (a, b) {
          if (sorters[name]) {
            const temp = a;
            const temp2 = b;
            a = temp2;
            b = temp;
          }
          const first = a[name].toUpperCase();
          const second = b[name].toUpperCase();
          if (first < second) return -1;
          if (first > second) return 1;
          else return 0;
        });
      } else {
        items.sort(function (a, b) {
          if (sorters[name]) {
            const temp = a;
            const temp2 = b;
            a = temp2;
            b = temp;
          }
          if (a[name] < b[name]) return -1;
          if (a[name] > b[name]) return 1;
          else return 0;
        });
      }

      this.setState({ data: items });
    }
    return;
  };
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
  getFilters = () => {
    const obj = {};
    if (this.state.name) {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + " AND #n = :n"
        : "#n = :n";
      const newObj = {
        "#n": "name",
      };
      obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
        ? { ...newObj, ...obj.ExpressionAttributeNames }
        : newObj;
      const newObjA = {
        ":n": this.state.name,
      };
      obj.ExpressionAttributeValues = obj.ExpressionAttributeValues
        ? { ...newObjA, ...obj.ExpressionAttributeValues }
        : newObjA;
    }
    if (this.state.sector) {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + " AND #s = :s"
        : "#s = :s";
      const newObj = {
        "#s": "sector",
      };
      obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
        ? { ...newObj, ...obj.ExpressionAttributeNames }
        : newObj;
      const newObjA = {
        ":s": this.state.sector,
      };
      obj.ExpressionAttributeValues = obj.ExpressionAttributeValues
        ? { ...newObjA, ...obj.ExpressionAttributeValues }
        : newObjA;
    }
    if (this.state.siren) {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + " AND #si = :si"
        : "#si = :si";
      const newObj = {
        "#si": "siren",
      };
      obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
        ? { ...newObj, ...obj.ExpressionAttributeNames }
        : newObj;
      const newObjA = {
        ":si": this.state.siren,
      };
      obj.ExpressionAttributeValues = obj.ExpressionAttributeValues
        ? { ...newObjA, ...obj.ExpressionAttributeValues }
        : newObjA;
    }
    if (this.state.year) {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + " AND #y = :y"
        : "#y = :y";
      const newObj = {
        "#y": "year",
      };
      obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
        ? { ...newObj, ...obj.ExpressionAttributeNames }
        : newObj;
      const newObjA = {
        ":y": this.state.year,
      };
      obj.ExpressionAttributeValues = obj.ExpressionAttributeValues
        ? { ...newObjA, ...obj.ExpressionAttributeValues }
        : newObjA;
    }
    return obj;
  };
  getData = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...this.getFilters(),
        Limit: this.state.Limit,
        ExclusiveStartKey: this.state.ExclusiveStartKey,
      }),
    };
    try {
      const response = await fetch(
        app_env.url.API_URL + "/scan_entreprises",
        requestOptions
      );
      const data = await response.json();
      this.setState({ data: [...this.state.data, ...data.Items] }, () => {
        if (Object.keys(this.state.sorters)[0])
          this.sortByName(Object.keys(this.state.sorters)[0], true);
      });
      if (data.LastEvaluatedKey) {
        this.setState({ ExclusiveStartKey: data.LastEvaluatedKey }, () => {
          if (data.Items.length < this.state.Limit) {
            console.log(
              "found : " +
                data.Items.length +
                " OF " +
                this.state.Limit +
                " SCANNING NEXT CURSOR  ",
              data.LastEvaluatedKey
            );
            this.getData();
          }
        });
      } else {
        console.log("END found :" + data.Items.length);
        this.setState({ ExclusiveStartKey: undefined });
      }
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
    this.setState({ data: [], ExclusiveStartKey: undefined }, () => {
      this.getData();
    });
  };
  handleStrings = (e, { name, value }) => {
    this.setState({ [name]: value });
    this.setState({ ExclusiveStartKey: undefined });
  };
  handleNumbers = (e, { name, value }) => {
    this.setState({ [name]: parseInt(value) });
    if (name !== "Limit") this.setState({ ExclusiveStartKey: undefined });
  };
  render() {
    return (
      <div>
        <Form className="ui mini">
          <Form.Field>
            <Modal buttonName="Add entreprise" />
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Limit</label>
              <Dropdown
                name="Limit"
                defaultValue={this.state.Limit.toString()}
                fluid
                selection
                options={limitOptions}
                onChange={this.handleNumbers}
              />
            </Form.Field>
            <Form.Field>
              <label>Name</label>
              <Input
                name="name"
                placeholder="Search name"
                maxLength="50"
                onChange={this.handleStrings}
              ></Input>
            </Form.Field>
            <Form.Field>
              <label>Sector</label>
              <Input
                name="sector"
                placeholder="Search sector"
                maxLength="50"
                onChange={this.handleStrings}
              ></Input>
            </Form.Field>
            <Form.Field>
              <label>Siren</label>
              <Input
                type="number"
                name="siren"
                placeholder="Search siren"
                maxLength="9"
                onChange={this.handleNumbers}
              ></Input>
            </Form.Field>
            <Form.Field>
              <label>Year</label>
              <Input
                type="number"
                name="year"
                placeholder="Search year"
                min="1800"
                onChange={this.handleNumbers}
              ></Input>
            </Form.Field>
            <Form.Field>
              <Button
                className="ui medium top-padded search"
                basic
                icon
                labelPosition="left"
                onClick={this.reloadTable}
                type="submit"
              >
                <Icon name="search" color="green" />
                Search
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <div>
          <Dimmer active={this.state.loading} inverted>
            <Loader />
          </Dimmer>
          <Segment basic>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Segment>
          <MyTable
            data={this.state.data}
            deleteRow={this.deleteRow}
            sort={this.sortByName}
          />
          <Segment basic className="center-this">
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
          </Segment>
        </div>
      </div>
    );
  }
}
export default Table;
