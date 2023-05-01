import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

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
            icon={<Icon name="home" color="teal"></Icon>}
            name=""
            active={activeItem === ""}
            content="Home"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon={<Icon name="envelope" color="teal"></Icon>}
            name="contact"
            active={activeItem === "contact"}
            content="Contact"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon={<Icon name="cog" color="teal"></Icon>}
            name="parameters"
            active={activeItem === "parameters"}
            content="Parameters"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon={<Icon name="sign-out" color="teal"></Icon>}
            name="logout"
            active={activeItem === "logout"}
            content="Logout"
            onClick={this.handleItemClick}
          />
        </Menu>
      </div>
    );
  }
}
