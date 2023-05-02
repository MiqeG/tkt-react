import { Divider, Segment } from "semantic-ui-react";
import PasswordForm from "../components/PasswordForm";
const Parameters = () => {
  return (
    <Segment className="container">
      <h1>
        <i className="cog icon teal"></i> Settings
      </h1>
      <Divider></Divider>
      <PasswordForm></PasswordForm>
    </Segment>
  );
};
export default Parameters;
