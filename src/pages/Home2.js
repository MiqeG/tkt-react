import AwsTable from "../components/AwsTable";
import { Divider, Segment } from "semantic-ui-react";
const Home = () => {
  return (
    <Segment>
      <h1>
        <i className="home icon green"></i>Home2
      </h1>
      <Divider></Divider>
      <AwsTable></AwsTable>
    </Segment>
  );
};

export default Home;
