import Table from "../components/Table";
import { Divider, Container, Segment } from "semantic-ui-react";
const Home = () => {
  return (
    <Container>
      <Segment>
        <h1>
          <i className="home icon green"></i>Home
        </h1>
        <Divider></Divider>
        <Table></Table>
      </Segment>
    </Container>
  );
};

export default Home;
