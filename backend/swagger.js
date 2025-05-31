const swaggerAuto = require("swagger-autogen");
const swaggerAutogen = swaggerAuto();

const doc = {
  info: {
    title: "Contacts API",
    description: "Contacts API",
  },
  host: "cse-341-w02-e31k.onrender.com",
  schemes: ["https", "http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
