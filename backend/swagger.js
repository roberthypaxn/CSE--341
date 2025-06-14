const swaggerAuto = require("swagger-autogen");
const swaggerAutogen = swaggerAuto();
//Cse-341-w03-ei9o.onrender.com
const doc = {
  info: {
    title: "Movie Reviews API",
    description: "Movie Reviews API",
  },
  host: "localhost:8080",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//Generate swagger json

swaggerAutogen(outputFile, endpointsFiles, doc);
