import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { Button } from "semantic-ui-react";

const columns = [
  { title: "Name", data: "name" },
  { title: "Sector", data: "sector" },
  { title: "Siren", data: "siren" },
  { title: "Ca", data: "ca" },
  { title: "Ebitda", data: "ebitda" },
  { title: "Loss", data: "loss" },
  { title: "Margin", data: "margin" },
  { title: "Year", data: "year" },
  { title: "Delete", data: null, sortable: false },
];
class DataTableComp extends Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: columns,
      columnDefs: [
        {
          targets: [8],
          width: 180,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <Button
                basic
                siren={rowData.siren}
                year={rowData.year}
                onClick={() => {
                  this.props.deleteRow(rowData);
                }}
              >
                Delete
              </Button>,
              td
            ),
        },
      ],
      select: {
        style: "multi",
      },
      paging: true,
      order: [[0, "asc"]],
      pageLength: 10,
    });
  }
  componentWillUnmount() {
    $("#dataTable").DataTable().destroy(true);
  }
  reloadTableData = (data) => {
    const table = $("#dataTable").DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.length !== this.props.data.length) {
      this.reloadTableData(nextProps.data);
    }
    return false;
  }
  render() {
    return (
      <div>
        <table
          className="ui teal table"
          id="dataTable"
          width="100%"
          cellSpacing="0"
          ref={(el) => (this.el = el)}
        />
      </div>
    );
  }
}
export default DataTableComp;
