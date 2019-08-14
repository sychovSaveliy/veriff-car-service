const apiConfig = {
  protocol: "http",
  host: "localhost",
  port: 5000
};

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const getPath = () =>
  IS_DEVELOPMENT
    ? `${apiConfig.protocol}://${apiConfig.host}${
        apiConfig.port ? ":" + apiConfig.port : ""
      }`
    : "";

export const fetch = (url, options = {}) => {
  if (!url) return;
  if (options.body) {
    options.body = JSON.stringify(options.body);
  }
  // options.headers.authorization = localStorage.getItem('jwt') || '';
  options.headers = options.headers || {};
  options.headers["Access-Control-Allow-Headers"] =
    "Access-Control-Request-Headers,Content-Type";
  options.headers["Content-Type"] = "application/json";
  return window
    .fetch(`${getPath() + url}`, options)
    .then(resp => resp.json())
    .catch(console.warn);
};
