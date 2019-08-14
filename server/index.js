let express = require("express");
let app = express();
let bodyParser = require("body-parser");
var serveStatic = require("serve-static");
let $data = require("./../dist/routes/data");
const {
  veriffHandler,
  veriffWebhook,
  checkAvaliablity
} = require("./Verification");
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

app.get("/cars", $data.mainReq).get("/configs", $data.mainReq);

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://savelii-veriff:veriff@cluster0-5ov4c.mongodb.net/test?retryWrites=true&w=majority";
var settings = {
  reconnectTries: Number.MAX_VALUE,
  autoReconnect: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const client = new MongoClient(uri, settings);

app.post("/signup", (req, res) => {
  client.connect(() => {
    const collection = client.db("veriff-savelii").collection("users");
    let record = {
      token: req.body.token,
      startTime: Date.now(),
      live: 180000 // 3 min
    };

    collection.insertOne(record, (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.json({ result });
    });
    client.close();
  }, settings);
});

app.post("/check", (req, res) => {
  client.connect(() => {
    let token = req.body.token;

    const collection = client.db("veriff-savelii").collection("users");
    collection.find({ token: { $eq: token } }).toArray((err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      let answer = checkAvaliablity(result && result[0]);
      res.json(answer);
    });
    client.close();
  }, settings);
});

app.listen(port);
console.log("Mock server listening on port " + port);

module.exports = {
  app
};
