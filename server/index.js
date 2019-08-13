let express = require("express");
let app = express();
let bodyParser = require("body-parser");
var serveStatic = require("serve-static");
let $data = require("./../dist/routes/data");
const { veriffHandler, veriffWebhook } = require("./Verification");
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

app.use(serveStatic(__dirname + "/../dist"));

app.get("/", function(req, res) {
  return res.json({
    message: "UI API!"
  });
});

app.route("/veriff/api").post(veriffHandler);
app.route("/veriff/webhook").post(veriffWebhook);

app.route("/emulate").post((req, res) => {
  const { EmulateCars } = require("./Emulation");
  let response = EmulateCars(req.body.size, req.body.position);
  console.log(
    `Emulate cars -> size = ${req.body.size}, user position ${JSON.stringify(
      req.body.position
    )}`
  );
  res.json(response);
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
