import AwsTable from "../components/AwsTable";
import { Divider, Segment } from "semantic-ui-react";
const Home = () => {
  return (
    <Segment className="container">
      <h1>
        <i className="home icon teal"></i>Home
      </h1>
      <Divider></Divider>
      <AwsTable></AwsTable>
    </Segment>
  );
};

export default Home;
