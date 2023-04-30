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

import SectorDropDown from "./SectorDropDown";
import { backendCall } from "../callFetch";
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
    key: "9999",
    text: "9999",
    value: "9999",
  },
];
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sector: "",
      siren: "",
      year: "",
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
        const newData = this.state.data.filter((i) => {
          return i.year + i.siren !== item.year + item.siren;
        });
        this.setState({ data: newData }, () => {
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  };

  updateItemInTable = (item) => {
    const index = this.state.data.findIndex((element) => {
      if (element.siren === item.siren && element.year === item.year) {
        return true;
      }
      return false;
    });
    if (index !== -1) {
      const newArr = this.state.data;
      newArr[index] = item;
      return this.setState({ data: newArr });
    } else {
      const error = "Element not found in table";
      console.error(error);
      return alert(error);
    }
  };
  batchWrite = (items, type) => {
    const body = {
      [type]: true,
      Items: items,
    };
    return new Promise(async (resolve, reject) => {
      try {
        const response = await backendCall("/batch_write", body);
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    });
  };
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
      try {
        const response = await backendCall("/delete_entreprise", item);
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  }
  getObj(obj, name, value) {
    const parsed = parseInt(value);
    if (!parsed) {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + ` AND contains(#${name} , :${name})`
        : `contains(#${name} , :${name})`;
    } else {
      obj.FilterExpression = obj.FilterExpression
        ? obj.FilterExpression + ` AND #${name} = :${name}`
        : `#${name} = :${name} `;
    }
    const newObj = {
      ["#" + name]: name,
    };
    obj.ExpressionAttributeNames = obj.ExpressionAttributeNames
      ? { ...newObj, ...obj.ExpressionAttributeNames }
      : newObj;
    const newObjA = {
      [":" + name]: parsed || value,
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
      obj = this.getObj(obj, "siren", this.state.siren);
    }
    if (this.state.year) {
      obj = this.getObj(obj, "year", this.state.year);
    }
    if (this.state.ca) {
      obj = this.getObj(obj, "ca", this.state.ca);
    }
    if (this.state.margin) {
      obj = this.getObj(obj, "margin", this.state.margin);
    }
    if (this.state.loss) {
      obj = this.getObj(obj, "loss", this.state.loss);
    }
    if (this.state.ebitda) {
      obj = this.getObj(obj, "ebitda", this.state.ebitda);
    }
    return obj;
  };
  getData = async () => {
    this.setState({ loading: true });

    try {
      const data = await backendCall("/scan_entreprises", {
        ...this.getFilters(),
        Limit: this.state.Limit,
        ExclusiveStartKey: this.state.ExclusiveStartKey,
      });
     
      this.setState({ data: [...this.state.data, ...data.Items] }, () => {
        if (Object.keys(this.state.sorters)[0])
          this.sortByName(Object.keys(this.state.sorters)[0], true);
      });
      if (data.LastEvaluatedKey) {
        this.setState({ ExclusiveStartKey: data.LastEvaluatedKey }, () => {
          if (data.Items.length < this.state.Limit) {
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
  componentDidMount() {}
  search = () => {
    if (
      !this.state.siren &&
      !this.state.year &&
      !this.state.name &&
      !this.state.sector
    )
      return this.setState({
        message: {
          title: "Error !",
          text: "A filter must be present",
          negative: true,
        },
      });
    if (this.state.siren && this.state.siren.toString().length !== 9)
      return this.setState({
        message: {
          title: "Error !",
          text: "Siren must be 9 in length",
          negative: true,
        },
      });
    if (this.state.year && this.state.year.toString().length !== 4)
      return this.setState({
        message: {
          title: "Error !",
          text: "Year must be 4 in length",
          negative: true,
        },
      });
    else {
      this.setState({
        message: undefined,
      });
      this.reloadTable();
    }
  };
  reloadTable = async () => {
    this.setState({ data: [], ExclusiveStartKey: undefined }, () => {
      this.getData();
    });
  };
  resetItems = () => {
    this.setState({ data: [], ExclusiveStartKey: undefined });
    return;
  };
  resetFilters = () => {
    this.setState({ name: "", sector: "", siren: "", year: "", Limit: 500 });
  };
  handleStrings = (e, { name, value }) => {
    this.setState({ [name]: value });
    this.setState({ ExclusiveStartKey: undefined });
  };
  handleNumbers = (e, { name, value }) => {
    this.setState({ [name]: parseInt(value) || "" });
    if (name !== "Limit") this.setState({ ExclusiveStartKey: undefined });
  };
  handleSectorDropDownChange = (value) => {
    this.setState({ sector: value });
  };
  getMessageSegmet = () => {
    if (this.state.message)
      return (
        <Segment basic>
          <MessageSuccessError
            message={this.state.message}
          ></MessageSuccessError>
        </Segment>
      );
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
                fluid
                selection
                options={limitOptions}
                onChange={this.handleNumbers}
                value={this.state.Limit.toString()}
              />
            </Form.Field>
            <Form.Field>
              <label>Name</label>
              <Input
                name="name"
                placeholder="Name"
                maxLength="50"
                onChange={this.handleStrings}
                value={this.state.name}
              ></Input>
            </Form.Field>
            <Form.Field>
              <label>Sector</label>

              <SectorDropDown
                handleChange={this.handleSectorDropDownChange}
                value={this.state.sector}
              ></SectorDropDown>
            </Form.Field>
            <Form.Field>
              <label>Siren</label>
              <Input
                type="number"
                name="siren"
                placeholder="Siren"
                onChange={this.handleNumbers}
                value={this.state.siren}
              ></Input>
            </Form.Field>
            <Form.Field>
              <label>Year</label>
              <Input
                type="number"
                name="year"
                placeholder="Year"
                onChange={this.handleNumbers}
                value={this.state.year}
              ></Input>
            </Form.Field>
            <Form.Field>
              <Button
                className="ui medium top-padded search"
                basic
                icon
                labelPosition="left"
                onClick={() => this.search()}
              >
                <Icon name="search" color="teal" />
                Search
              </Button>
            </Form.Field>
            <Form.Field>
              <Button
                className="ui medium top-padded search"
                basic
                icon
                labelPosition="left"
                onClick={() => this.resetFilters()}
              >
                <Icon name="refresh" color="teal" />
                Reset Filters
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <div>
          <Dimmer active={this.state.loading} inverted>
            <Loader />
          </Dimmer>
          {this.getMessageSegmet()}
          <MyTable
            data={this.state.data}
            deleteRow={this.deleteRow}
            batchWrite={this.batchWrite}
            sort={this.sortByName}
            resetItems={this.resetItems}
            reloadTable={this.reloadTable}
            updateItemInTable={this.updateItemInTable}
          />
          <Segment basic className="center-this">
            <Button
              basic
              icon
              labelPosition="left"
              disabled={!this.state.ExclusiveStartKey}
              onClick={this.getData}
            >
              <Icon name="cloud download" color="teal" />
              More data
            </Button>
          </Segment>
        </div>
      </div>
    );
  }
}
export default Table;
