import Table from "../components/Table";
import { Divider, Segment } from "semantic-ui-react";
const Home = () => {
  return (
    <Segment>
      <h1>
        <i className="home icon green"></i>Home
      </h1>
      <Divider></Divider>
      <Table></Table>
    </Segment>
  );
};

export default Home;
