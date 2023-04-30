import React from "react";
import { Button, Header, Form, Modal, Icon } from "semantic-ui-react";
import MessageSuccessError from "./MessageSuccessError";
import app_env from "../AppEnv";
function ForgotPasswordModal() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);
  const [formState, setFormState] = React.useState("start");
  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVerification, setPasswordVerification] = React.useState("");
  const [passwordVerificationVisible, setPasswordVerificationVisible] =
    React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const handleChange = (e, { name, value }) => {
    if (name === "email") setEmail(value);
    if (name === "code") setCode(value);
    if (name === "password") setPassword(value);
    if (name === "passwordVerification") setPasswordVerification(value);
  };
  const handlePasswordIconClick = (e, { name, value }) => {
    if (value === "password") {
      setPasswordVisible(!passwordVisible);
    }
    if (value === "passwordVerification") {
      setPasswordVerificationVisible(!passwordVerificationVisible);
    }
  };
  const send = async () => {
    if (!email) return;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    };
    setLoading(true);
    const response = await fetch(
      app_env.url.API_URL + "/login/forgot_password",
      requestOptions
    );
    setLoading(false);
    if (response.status > 301 || response.status < 200) {
      setMessage({
        negative: true,
        title: "Error !",
        text: "An error occured",
      });
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.$metadata.httpStatusCode !== 200)
          setMessage({
            negative: true,
            title: "Error !",
            text: data.message || data.code || data,
          });
        else {
          setMessage({
            positive: true,
            title: "Success !",
            text:
              "An email has been sent to " +
              email +
              ". Dont forget to check spam folder.",
          });
          setFormState("pending");
        }
      } else {
        const text = await response.text();
        setMessage({
          negative: true,
          title: "Error !",
          text: text,
        });
      }
    }
  };
  const resetPassword = async () => {
    if (!password) return;
    if (password !== passwordVerification)
      return setMessage({
        negative: true,
        title: "Error !",
        text: "Verification failed",
      });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        code: code,
        password: password,
      }),
    };
    setLoading(true);
    const response = await fetch(
      app_env.url.API_URL + "/login/confirm_forgot_password",
      requestOptions
    );
    setLoading(false);
    if (response.status > 301 || response.status < 200) {
      return setMessage({
        negative: true,
        title: "Error !",
        text: "Unauthorized status :" + response.status,
      });
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      if (data.$metadata.httpStatusCode !== 200)
        setMessage({
          negative: true,
          title: "Error !",
          text: "Unauthorized status :" + data.$metadata.httpStatusCode,
        });
      else {
        setMessage({
          positive: true,
          title: "Success !",
          text: "Password has been reset",
        });
        setFormState("done");
      }
    } else {
      const text = await response.text();
      setMessage({
        negative: true,
        title: "Error !",
        text: text,
      });
    }
  };

  const conditionalForm = () => {
    if (formState === "start")
      return (
        <Modal.Description>
          <Header>Enter e-mail to start password recovery</Header>
          <Form>
            <Form.Field>
              <Form.Input
                name="email"
                placeholder="E-mail"
                iconPosition="left"
                icon={<Icon name="envelope" />}
                value={email}
                onChange={handleChange}
              ></Form.Input>
            </Form.Field>
            <MessageSuccessError message={message}></MessageSuccessError>
          </Form>
        </Modal.Description>
      );
    else if (formState === "pending") {
      return (
        <Modal.Description>
          <Header>Enter code and password to reset password</Header>
          <Form>
            <Form.Input
              className="hidden inp"
              name="email"
              autoComplete="email"
              placeholder="E-mail"
              iconPosition="left"
              icon={<Icon name="envelope" />}
              value={email}
              disabled
            ></Form.Input>
            <Form.Field>
              <Form.Input
                name="code"
                autoComplete="mfa_code"
                placeholder="Code"
                iconPosition="left"
                icon={<Icon name="lock" />}
                value={code}
                onChange={handleChange}
              ></Form.Input>
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                type={passwordVisible ? "text" : "password"}
                iconPosition="left"
                icon={
                  <Icon
                    className="pointer-class"
                    value="password"
                    link
                    name={passwordVisible ? "eye slash" : "eye"}
                    onClick={handlePasswordIconClick}
                  />
                }
                value={password}
                onChange={handleChange}
              ></Form.Input>
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="passwordVerification"
                placeholder="Verify password"
                type={passwordVerificationVisible ? "text" : "password"}
                autoComplete="new-password"
                iconPosition="left"
                icon={
                  <Icon
                    link
                    className="pointer-class"
                    name={passwordVerificationVisible ? "eye slash" : "eye"}
                    value="passwordVerification"
                    onClick={handlePasswordIconClick}
                  />
                }
                value={passwordVerification}
                onChange={handleChange}
              ></Form.Input>
            </Form.Field>
            <MessageSuccessError message={message}></MessageSuccessError>
          </Form>
        </Modal.Description>
      );
    } else if (formState === "done") {
      return (
        <Modal.Description>
          <Header>Done !</Header>
          <Form>
            <MessageSuccessError message={message}></MessageSuccessError>
          </Form>
        </Modal.Description>
      );
    }
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<div className="link style">Forgot your password ?</div>}
    >
      <Modal.Header>Forgot password ?</Modal.Header>
      <Modal.Content>{conditionalForm()}</Modal.Content>
      <Modal.Actions>
        <Button
          content="Send"
          labelPosition="left"
          icon="checkmark"
          onClick={
            formState === "start"
              ? () => {
                  send();
                }
              : () => {
                  resetPassword();
                }
          }
          color="teal"
          loading={loading}
          disabled={formState === "done" ? true : false}
        />
        <Button
          content="Close"
          labelPosition="left"
          icon={<Icon name="times" color="red"></Icon>}
          onClick={() => setOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ForgotPasswordModal;
