const swaggerAuto = require("swagger-autogen");
const swaggerAutogen = swaggerAuto();

const doc = {
  info: {
    title: "Car Rental API",
    description: "Car Rental API",
  },
  host: "localhost:8080",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
