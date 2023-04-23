import React from "react";
import { Checkbox, Table } from "semantic-ui-react";
class MyTable extends React.Component {
  state = {
    set: false,
    checkMap: {},
    sort: {},
    headerCells: [
      { name: "name", Text: "Name" },
      { name: "sector", Text: "Sector" },
      { name: "siren", Text: "Siren" },
      { name: "year", Text: "Year" },
      { name: "ca", Text: "Ca" },
      { name: "margin", Text: "Margin" },
      { name: "loss", Text: "Loss" },
      { name: "ebitda", Text: "Ebitda" },
    ],
  };
  setSort = (name) => {
    const temp = {
      [name]: this.state.sort[name] ? !this.state.sort[name] : true,
    };
    this.setState({ sort: temp });
  };
  setCheckedUnchecked = (key) => {
    const current = { ...this.state.checkMap };
    if (typeof current[key] == "undefined") current[key] = true;
    else delete current[key];
    this.setState({ checkMap: current });
  };
  setAll = () => {
    const toggle = !this.state.set;
    const newMap = {};
    this.props.data.forEach((element) => {
      newMap[element.siren + "_" + element.year] = toggle;
    });
    this.setState({ set: toggle });
    this.setState({ checkMap: newMap });
  };
  getSorterIcon = (name, sorting) => {
    if (!this.props.data.length) return;
    if (sorting === true) return <i className="arrow up icon"></i>;
    else if (sorting === false) {
      return <i className="arrow down icon"></i>;
    } else return;
  };
  getTableHeaderCell = (name, Text) => {
    return (
      <Table.HeaderCell key={name}>
        <div
          className="pointer-class"
          name={name}
          onClick={() => {
            this.props.sort(name);
            this.setSort(name);
          }}
        >
          {this.getSorterIcon(name, this.state.sort[name])}
          <span>{Text}</span>
        </div>
      </Table.HeaderCell>
    );
  };
  getHeaderRow = () => {
    const rows = [];
    for (let i = 0; i < this.state.headerCells.length; i++) {
      const element = this.state.headerCells[i];
      rows.push(this.getTableHeaderCell(element.name, element.Text));
    }
    return rows;
  };
  componentDidMount() {}

  render() {
    return (
      <div>
        <Table color="green">
          <Table.Header>
            <Table.Row>
              {this.getHeaderRow()}
              <Table.HeaderCell>
                <div className="pointer-class" onClick={this.setAll}>
                  Select
                </div>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.data.map((object, i) => (
              <ObjectRow
                obj={object}
                key={i}
                setCheckedUnchecked={this.setCheckedUnchecked}
                setAll={this.setAll}
                check={
                  this.state.checkMap[object.siren + "_" + object.year] || false
                }
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

class ObjectRow extends React.Component {
  componentDidMount() {}
  handleEvents = (e, obj) => {
    this.props.setCheckedUnchecked(
      this.props.obj.siren + "_" + this.props.obj.year
    );
  };
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.obj.name}</Table.Cell>
        <Table.Cell>{this.props.obj.sector}</Table.Cell>
        <Table.Cell>{this.props.obj.siren}</Table.Cell>
        <Table.Cell>{this.props.obj.year}</Table.Cell>
        <Table.Cell>{this.props.obj.ca}</Table.Cell>
        <Table.Cell>{this.props.obj.margin}</Table.Cell>
        <Table.Cell>{this.props.obj.loss}</Table.Cell>
        <Table.Cell>{this.props.obj.ebitda}</Table.Cell>
        <Table.Cell>
          <Checkbox
            data-year={this.props.obj.year}
            data-siren={this.props.obj.siren}
            label={{ children: "" }}
            onChange={this.handleEvents}
            checked={this.props.check}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}
export default MyTable;
