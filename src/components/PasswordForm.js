import React from "react";
import { Form, Icon, Button } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import { backendCall } from "../callFetch";

class PasswordForm extends React.Component {
  state = {
    email: "",
    loading: false,
    password: "",
    newPassword: "",
    newPasswordVerification: "",
    passwordVisible: false,
    newPasswordVisible: false,
    newPasswordVerificationVisible: false,
  };

  handlePasswordIconClick = (e, { name, value }) => {
    const current = this.state[value + "Visible"];
    this.setState({ [value + "Visible"]: !current });
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  send = async () => {
    this.setState({ message: undefined });
    if (!this.state.password || !this.state.newPassword) return;
    if (this.state.newPassword !== this.state.newPasswordVerification) {
      return this.setState({
        message: {
          negative: true,
          title: "Error !",
          text: "Verification failed",
        },
      });
    }
    try {
      this.setState({ loading: true });
      await backendCall("/change_password", {
        password: this.state.password,
        newPassword: this.state.newPassword,
      });
      return this.setState({
        loading: false,
        message: {
          positive: true,
          title: "Success !",
          text: "Password changed",
        },
      });
    } catch (error) {
      return this.setState({
        message: {
          negative: true,
          title: "Error !",
          text: error.message || error.code || error,
        },
        loading: false,
      });
    }
  };
  render() {
    return (
      <Form onSubmit={this.send}>
        <h3>Change password</h3>
        <Form.Field className="hidden inp">
          <label>Email</label>
          <Form.Input
            type="text"
            autoComplete="none"
            disabled
            placeholder="Email"
          ></Form.Input>
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <Form.Input
            disabled={this.state.loading}
            type={this.state.passwordVisible ? "text" : "password"}
            autoComplete="none"
            placeholder="Password"
            iconPosition="left"
            value={this.password}
            onChange={this.handleChange}
            name="password"
            max-length="80"
            icon={
              <Icon
                className="pointer-class"
                name={this.state.passwordVisible ? "eye slash" : "eye"}
                link
                color="teal"
                value="password"
                onClick={this.handlePasswordIconClick}
              ></Icon>
            }
          ></Form.Input>
        </Form.Field>
        <Form.Field>
          <label>New password</label>
          <Form.Input
            disabled={this.state.loading}
            type={this.state.newPasswordVisible ? "text" : "password"}
            autoComplete="none"
            placeholder="New password"
            iconPosition="left"
            value={this.newPassword}
            onChange={this.handleChange}
            max-length="80"
            name="newPassword"
            icon={
              <Icon
                className="pointer-class"
                name={this.state.newPasswordVisible ? "eye slash" : "eye"}
                link
                color="teal"
                value="newPassword"
                onClick={this.handlePasswordIconClick}
              ></Icon>
            }
          ></Form.Input>
        </Form.Field>
        <Form.Field>
          <label>Verify new password</label>
          <Form.Input
            disabled={this.state.loading}
            type={
              this.state.newPasswordVerificationVisible ? "text" : "password"
            }
            autoComplete="none"
            placeholder="Verify new password"
            iconPosition="left"
            value={this.newPasswordVerification}
            onChange={this.handleChange}
            max-length="80"
            name="newPasswordVerification"
            icon={
              <Icon
                className="pointer-class"
                name={
                  this.state.newPasswordVerificationVisible
                    ? "eye slash"
                    : "eye"
                }
                link
                color="teal"
                value="newPasswordVerification"
                onClick={this.handlePasswordIconClick}
              ></Icon>
            }
          ></Form.Input>
        </Form.Field>
        <Form.Field>
          <MessageSuccessError
            message={this.state.message}
          ></MessageSuccessError>
        </Form.Field>
        <Form.Field>
          <Button
            type="submit"
            loading={this.state.loading}
            content="Send"
            basic
            icon={<Icon name="check" color="teal"></Icon>}
            labelPosition="left"
            text="Send"
          />
        </Form.Field>
      </Form>
    );
  }
}
export default PasswordForm;
