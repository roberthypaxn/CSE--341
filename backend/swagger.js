const swaggerAuto = require("swagger-autogen");
const swaggerAutogen = swaggerAuto();

const doc = {
  info: {
    title: "Car Rental API",
    description: "Car Rental API",
  },
  host: "https://cse-341-1-q96r.onrender.com",
  schemes: ["https", "http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
