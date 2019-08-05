let express = require("express");
let app = express();
let bodyParser = require("body-parser");
var serveStatic = require("serve-static");
let $data = require("./dist/routes/data");
const port = process.env.PORT || 5000;
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.text());
app.use(
  bodyParser.json({
    type: "application/json"
  })
);
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Access-Control-Request-Headers,access-control-allow-headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(serveStatic(__dirname + "/dist"));

app.get("/", function(req, res) {
  return res.json({
    message: "UI API!"
  });
});
app.route("/configs").get((req, res) => {
  res.json({
    PORT: port
  });
});

app
  .route("*")
  .get($data.mainReq)
  .post($data.mainReq);

app.listen(port);
console.log("Mock server listening on port " + port);

module.exports = {
  app
};
