const swaggerAutogenFn = require("swagger-autogen");
const swaggerAutogen = swaggerAutogenFn();

const doc = {
  info: {
    title: "Users API",
    description: "Users API",
  },
  host: "localhost:8080",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
