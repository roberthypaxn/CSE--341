const swaggerAuto = require("swagger-autogen");
const swaggerAutogen = swaggerAuto();

const doc = {
  info: {
    title: "Movie Reviews API",
    description: "Movie Reviews API",
  },
  host: "cse-341-1-3t67.onrender.com",
  schemes: ["https", "http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
