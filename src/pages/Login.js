import LoginForm from "../components/LoginForm";
import React from "react";
import { verifyToken } from "../verifyTokens";
import loader from "../audio.svg";
class Login extends React.Component {
  state = {
    not_logged: false,
  };
  verify = async () => {
    try {
      await verifyToken();
      return (window.location.href = "/");
    } catch (error) {
      this.setState({ not_logged: true });
    }
  };
  componentDidMount() {
    this.verify();
  }

  render() {
    return this.state.not_logged ? (
      <>
        <div className="login connection">{<LoginForm></LoginForm>}</div>;
      </>
    ) : (
      <div className="loader_image ui container">
        {<img className="loader_image" src={loader} alt="loader" />}
      </div>
    );
  }
}
export default Login;
