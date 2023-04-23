import React, { Component } from "react";
import MyTable from "./MyTable";
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
  deleteRow = (item) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.deleteData(item);
      } catch (error) {
        return reject(error);
      }
      const filteredData = this.state.data.filter(
        (i) =>
          i.siren.toString() + i.year.toString() !==
          item.siren.toString() + item.year.toString()
      );
      this.setState({ data: filteredData }, () => {
        return resolve();
      });
    });
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
  getObj(obj, name, value) {
    obj.FilterExpression = obj.FilterExpression
      ? obj.FilterExpression + ` AND #${name} = :${name}`
      : `#${name} = :${name}`;
    const newObj = {
      ["#" + name]: name,
    };
    obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
      ? { ...newObj, ...obj.ExpressionAttributeNames }
      : newObj;
    const newObjA = {
      [":" + name]: value,
    };
    obj.ExpressionAttributeValues = obj.ExpressionAttributeValues
      ? { ...newObjA, ...obj.ExpressionAttributeValues }
      : newObjA;
    return obj;
  }
  getFilters = () => {
    let obj = {};

    if (this.state.name) {
      obj = this.getObj(obj, "name", this.state.name);
    }
    if (this.state.sector) {
      obj = this.getObj(obj, "sector", this.state.sector);
    }
    if (this.state.siren) {
      obj = this.getObj(obj, "siren", parseInt(this.state.siren));
    }
    if (this.state.year) {
      obj = this.getObj(obj, "year", parseInt(this.state.year));
    }
    if (this.state.ca) {
      obj = this.getObj(obj, "ca", parseInt(this.state.ca));
    }
    if (this.state.margin) {
      obj = this.getObj(obj, "margin", parseInt(this.state.margin));
    }
    if (this.state.loss) {
      obj = this.getObj(obj, "loss", parseInt(this.state.loss));
    }
    if (this.state.ebitda) {
      obj = this.getObj(obj, "ebitda", parseInt(this.state.ebitda));
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
