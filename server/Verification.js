const crypto = require("crypto");
const fetch = require("node-fetch");
const API_URL = "https://api.veriff.me/v1";

function generateSignature(payload, secret) {
  if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
  }

  if (payload.constructor !== Buffer) {
    payload = Buffer.from(payload, "utf8");
  }

  const signature = crypto.createHash("sha256");
  signature.update(payload);
  signature.update(new Buffer(secret, "utf8"));
  return signature.digest("hex");
}

function timestamp() {
  return new Date().toISOString();
}

function veriffHandler(req, res) {
  const API_TOKEN = req.body.API_TOKEN;
  const API_SECRET = req.body.API_SECRET;
  const sessionId = req.body.sessionId;
  const status = req.body.status;
  const payload = {
    verification: {
      frontState: "done",
      status: status,
      timestamp: timestamp()
    }
  };
  const headers = {
    "x-auth-client": API_TOKEN,
    "x-signature": generateSignature(sessionId, API_SECRET),
    "content-type": "application/json"
  };
  const options = {
    method: "GET",
    headers: headers
  };
  fetch(`${API_URL}/sessions/${sessionId}/${req.body.endpoint}`, options)
    .then(resp => resp.json())
    .then(response => {
      res.json({ response });
    });
}

function veriffWebhook(req, res) {
  const API_TOKEN = req.body.API_TOKEN;
  const API_SECRET = req.body.API_SECRET;
  const sessionId = req.body.sessionId;
  const headers = {
    "x-auth-client": API_TOKEN,
    "x-signature": generateSignature(sessionId, API_SECRET),
    "content-type": "application/json"
  };
  const options = {
    method: "POST",
    headers: headers
  };
  fetch(`${API_URL}/webhooks/decision`, options)
    .then(resp => resp.json())
    .then(response => {
      res.json({ response });
    });
}

module.exports = { veriffHandler, veriffWebhook };
