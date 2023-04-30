const prod = {
  url: {
    API_URL: "https://7sa1dk63o2.execute-api.eu-west-1.amazonaws.com/production/",
  },
};
const dev = {
  url: {
    API_URL: "http://localhost:3001/production",
  },
};
export default process.env.NODE_ENV === "development" ? dev : prod;
