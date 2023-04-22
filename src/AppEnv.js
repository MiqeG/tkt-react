const prod = {
  url: {
    API_URL: "https://i2q4vjnnzg.execute-api.eu-west-1.amazonaws.com/production",
  },
};
const dev = {
  url: {
    API_URL: "http://localhost:3001",
  },
};
export default process.env.NODE_ENV === "development" ? dev : prod;
