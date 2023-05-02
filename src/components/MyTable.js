import React from "react";
import { Checkbox, Table, Form, Label } from "semantic-ui-react";
import Modal from "./Modal";
import ModalDelete from "./ModalDelete";
import ModalFill from "./ModalFillDb";
import UpdateModal from "./UpdateModal";
class MyTable extends React.Component {
  state = {
    set: false,
    checkMap: {},
    sort: {},
    rowClick: {},
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
      const id = element.siren + "_" + element.year;
      if (toggle === false) delete newMap[id];
      else newMap[id] = toggle;
    });
    return this.setState({ set: toggle, checkMap: newMap });
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
            this.props.sort(name, false);
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
  emptyCheckMap = (item) => {
    this.setState({ checkMap: {} });
  };
  deleteFromMap = (key) => {
    const map = this.state.checkMap;
    delete map[key];
    this.setState({ checkMap: map });
  };
  resetCheckMap = () => {
    this.setState({ checkMap: {} });
  };
  handleRowClick = (row) => {
    this.setState({ rowClick: row });
  };
  handleUpdateModalClose = () => {
    this.setState({ rowClick: {} });
  };
  rowClick = () => {
    if (this.state.rowClick.siren) {
      return (
        <UpdateModal
          buttonName="test"
          item={this.state.rowClick}
          close={this.handleUpdateModalClose}
          updateItemInTable={this.props.updateItemInTable}
          deleteRow={this.props.deleteRow}
        ></UpdateModal>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="ui divider"></div>
        <Form>
          {this.rowClick()}
          <Form.Group>
            <Form.Field>
              <Modal buttonName="Add entreprise" />
            </Form.Field>
            <Form.Field>
              <ModalDelete
                buttonName="Delete entreprises"
                checkMap={this.state.checkMap}
                deleteRow={this.props.deleteRow}
                emptyCheckMap={this.emptyCheckMap}
                deleteFromMap={this.deleteFromMap}
                batchWrite={this.props.batchWrite}
                reloadTable={this.props.reloadTable}
                resetCheckMap={this.resetCheckMap}
              />
            </Form.Field>
            <Form.Field>
              <ModalFill
                buttonName="Fill Db"
                batchWrite={this.props.batchWrite}
                reset={this.props.resetItems}
                reloadTable={this.props.reloadTable}
                resetCheckMap={this.resetCheckMap}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <div className="ui divider"></div>
        <Label color="teal" ribbon>
          Results : {this.props.data.length}
        </Label>
        <Table color="teal">
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
                handleRowClick={this.handleRowClick}
                colorrow={
                  i % 2 === 0
                    ? "odd colorrow pointer-class select-raised"
                    : "pair colorrow pointer-class select-raised"
                }
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
  handleEvents = (e, obj) => {
    this.props.setCheckedUnchecked(
      this.props.obj.siren + "_" + this.props.obj.year
    );
  };
  render() {
    return (
      <Table.Row className={this.props.colorrow}>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.name}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.sector}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.siren}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.year}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.ca}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.margin}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.loss}
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.handleRowClick(this.props.obj);
          }}
        >
          {this.props.obj.ebitda}
        </Table.Cell>
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
