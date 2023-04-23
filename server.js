const express = require("express");

let count = 0;

const app = express();

app.get("/", (request, response) => {
  response.send("Hejsan svejsan");
});
app.get("/foo", (request, response) => {
  response.send("bar");
});
app.get("/baz", (request, response) => {
  response.send("qux");
});
app.get("/count", (request, response) => {
  response.status(200).send(`${count}`);
});
app.post("/increment", (request, response) => {
  count++;
  response.status(200).send();
});

app.listen(8080, () => {
  console.log("Server startad på port 3000");
});
