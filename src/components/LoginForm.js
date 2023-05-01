import {
  Header,
  Segment,
  Grid,
  Image,
  Form,
  Button,
  Input,
  Message,
  Icon,
} from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import logo from "../logo.svg";
import React from "react";
import Cookies from "js-cookie";
import app_env from "../AppEnv";
import QRCode from "qrcode";
import ForgotPasswordModal from "./ForgotPasswordModal";
import setCookies from "../saveCookies";
class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    newPassword: "",
    newPasswordVerification: "",
    mfaCode: "",
    userCode: "",
    session: "",
    challenge: "",
    loading: false,
    passwordVisible: false,
    newPasswordVisible: false,
    newPasswordVerificationVisible: false,
    SecretCode: "",
    forgetEmail: "",
  };
  handleSend = (e, { name, value }) => {
    this.sendLogin(name);
  };
  handlePasswordIconClick = (e, { name, value }) => {
    const current = this.state[value + "Visible"];
    this.setState({ [value + "Visible"]: !current });
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  render() {
    return <Grid textAlign="center">{this.conditionalForm()} </Grid>;
  }

  sendLogin = async (name) => {
    if (!this.state.password || !this.state.email) return;
    const body = {
      email: this.state.email,
      password: this.state.password,
      mfaCode: this.state.mfaCode,
      newPassword: this.state.newPassword,
      session: this.state.session,
      userCode: this.state.userCode,
    };
    try {
      const response = await this.call(body, name);

      if (response.AuthenticationResult) {
        console.log("COOKIES SAVED VERIFY : ", setCookies(response));
        return (window.location.href = "/");
      } else {
        if (response.ChallengeName === "MFA_SETUP") {
          body.session = response.Session;
          const callResponse = await this.call(body, "/login/mfa_setup");
          return this.setState(
            {
              challenge: response.ChallengeName,
              SecretCode: callResponse.SecretCode,
              message: undefined,
              loading: false,
            },
            () => {
              const canvas = document.getElementById("qrcode_canvas");
              return QRCode.toCanvas(
                canvas,
                `otpauth://totp/device:${this.state.email}?secret=${callResponse.SecretCode}&issuer=tkt`,
                function (error) {
                  if (error) console.error(error);
                }
              );
            }
          );
        }
        return this.setState({
          challenge: response.ChallengeName,
          message: undefined,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
        message: {
          title: "Error !",
          text: error.message || error.stack || error,
          negative: true,
        },
      });
    }
  };

  call = (body, path) => {
    this.setState({ message: undefined, loading: true });
    return new Promise(async (resolve, reject) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      try {
        const response = await fetch(
          app_env.url.API_URL + path,
          requestOptions
        );
        if (response.status > 301 || response.status < 200)
          throw new Error("Unauthorized : " + response.status);
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
          if (data.$metadata.httpStatusCode !== 200)
            return reject({ code: data.$metadata.httpStatusCode });
          else {
            this.setState({ session: data.Session }, () => {
              return resolve(data);
            });
          }
        } else {
          data = await response.text();
          return reject({ code: 500, message: data });
        }
      } catch (error) {
        return reject(error);
      }
    });
  };
  sendNewPassword = async () => {
    this.setState({ message: undefined });
    if (
      !this.state.newPassword ||
      this.state.newPassword !== this.state.newPasswordVerification
    )
      return this.setState({
        message: {
          negative: true,
          title: "Error !",
          text: "Verification failed",
        },
      });
    else {
      await this.sendLogin("/login/new_password_challenge");
      this.setState({ password: this.state.newPassword });
    }
  };
  conditionalForm() {
    if (!this.state.challenge)
      return (
        <Grid.Column className="max-width loginner">
          <Header color="teal">
            <Image src={logo}></Image>
            <div className="content">Log-in to your account</div>
          </Header>
          <Form onSubmit={this.handleSend} name="/login">
            <Segment raised>
              <Form.Field>
                <Input
                  name="email"
                  autoComplete="email"
                  type="text"
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail"
                  value={this.state.email}
                  onChange={this.handleChange}
                  max-length="80"
                />
              </Form.Field>
              <Form.Field>
                <Input
                  name="password"
                  autoComplete="current-password"
                  type={this.state.passwordVisible ? "text" : "password"}
                  icon={
                    <Icon
                      name={this.state.passwordVisible ? "eye slash" : "eye"}
                      value="password"
                      link
                      onClick={this.handlePasswordIconClick}
                    />
                  }
                  iconPosition="left"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  max-length="80"
                />
              </Form.Field>
              <Button
                type="submit"
                fluid
                size="large"
                color="teal"
                loading={this.state.loading}
              >
                Login
              </Button>
            </Segment>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form>

          <Message>
            <ForgotPasswordModal></ForgotPasswordModal>
          </Message>
        </Grid.Column>
      );
    else if (this.state.challenge === "SOFTWARE_TOKEN_MFA")
      return (
        <Grid.Column className="max-width loginner">
          <Header color="teal">
            <Image src={logo}></Image>
            <div className="content">Enter Mfa</div>
          </Header>
          <Form onSubmit={this.handleSend} name="/login/software_token_mfa">
            <Segment raised>
              <Form.Field>
                <Input
                  name="mfaCode"
                  type="text"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Mfa"
                  value={this.state.mfaCode}
                  onChange={this.handleChange}
                  max-length="20"
                />
              </Form.Field>
              <Button
                type="submit"
                fluid
                size="large"
                color="teal"
                loading={this.state.loading}
              >
                Send
              </Button>
            </Segment>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form>
        </Grid.Column>
      );
    else if (this.state.challenge === "NEW_PASSWORD_REQUIRED") {
      return (
        <Grid.Column className="max-width loginner">
          <Header color="teal">
            <Image src={logo}></Image>
            <div className="content">Enter new password</div>
          </Header>
          <Form onSubmit={this.sendNewPassword} className="segment raised">
            <Form.Field>
              <Input
                name="email"
                autoComplete="email"
                type="text"
                icon="user"
                iconPosition="left"
                placeholder="E-mail"
                value={this.state.email}
                max-length="80"
                disabled
                className="hidden inp"
              />
            </Form.Field>
            <Form.Field>
              <label>New password</label>
              <Input
                name="newPassword"
                type={this.state.newPasswordVisible ? "text" : "password"}
                icon={
                  <Icon
                    name={this.state.newPasswordVisible ? "eye slash" : "eye"}
                    value="newPassword"
                    link
                    onClick={this.handlePasswordIconClick}
                  />
                }
                autoComplete="new-password"
                iconPosition="left"
                placeholder="New password"
                value={this.state.newPassword}
                onChange={this.handleChange}
                max-length="80"
              />
            </Form.Field>
            <Form.Field>
              <label>Verify password</label>
              <Input
                name="newPasswordVerification"
                type={
                  this.state.newPasswordVerificationVisible
                    ? "text"
                    : "password"
                }
                icon={
                  <Icon
                    name={
                      this.state.newPasswordVerificationVisible
                        ? "eye slash"
                        : "eye"
                    }
                    value="newPasswordVerification"
                    link
                    onClick={this.handlePasswordIconClick}
                  />
                }
                autoComplete="new-password"
                iconPosition="left"
                placeholder="Verify password"
                value={this.state.newPasswordVerification}
                onChange={this.handleChange}
                max-length="80"
              />
            </Form.Field>
            <Button
              type="submit"
              fluid
              size="large"
              color="teal"
              loading={this.state.loading}
            >
              Send
            </Button>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form>
        </Grid.Column>
      );
    } else if (this.state.challenge === "MFA_SETUP") {
      return (
        <Grid.Column className="max-width loginner">
          <Header color="teal">
            <Image src={logo}></Image>
            <div className="content">Mfa Setup</div>
          </Header>
          <Form onSubmit={this.handleSend} name="/login/verify_software_token">
            <Segment raised>
              <Form.Field>
                <label>
                  Scan this qr code / copy inside your authenticator app (ex
                  Google authenticator) and send the recieved code back
                </label>
                <canvas id="qrcode_canvas"></canvas>
              </Form.Field>
              <Form.Field>
                <Button
                  icon
                  labelPosition="left"
                  fluid
                  size="large"
                  color="teal"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.SecretCode);
                  }}
                >
                  <Icon name="copy" />
                  copy to clipboard
                </Button>
              </Form.Field>
              <Form.Field>
                <Input
                  name="userCode"
                  type="text"
                  icon="lock"
                  labelPosition="left"
                  placeholder="Auth code"
                  value={this.state.userCode}
                  onChange={this.handleChange}
                  max-length="20"
                />
              </Form.Field>
              <Button
                type="submit"
                fluid
                size="large"
                color="teal"
                loading={this.state.loading}
              >
                Send
              </Button>
            </Segment>
            <MessageSuccessError
              message={this.state.message}
            ></MessageSuccessError>
          </Form>
        </Grid.Column>
      );
    }
  }
}
export default LoginForm;
