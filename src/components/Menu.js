import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

export default class MenuExampleContentProp extends Component {
  state = {};

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    window.location.href = "/" + name;
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div className="topper">
        <Menu fixed="top">
          <Menu.Item
            icon="home"
            name=""
            active={activeItem === ""}
            content="Home"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="home"
            name="home2"
            active={activeItem === ""}
            content="Home2"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="users"
            name="blogs"
            active={activeItem === "blogs"}
            content="Blogs"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="envelope"
            name="contact"
            active={activeItem === "contact"}
            content="Contact"
            onClick={this.handleItemClick}
          />
        </Menu>
      </div>
    );
  }
}
