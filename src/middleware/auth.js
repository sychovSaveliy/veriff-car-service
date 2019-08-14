import { PATH_LOGIN } from "@/router";
import { Service } from "@/services";
const { API } = Service;

export default function auth({ next, router }) {
  if (!localStorage.getItem("jwt")) {
    return router.push(PATH_LOGIN);
  }

  asyncCheckingToken(localStorage.getItem("jwt"), router);

  return next();
}

function asyncCheckingToken(token, router) {
  API.fetch("/check", {
    method: "POST",
    body: {
      token
    }
  }).then(resp => {
    if (resp && resp.status != "allow") {
      router.push(PATH_LOGIN);
    }
  });
}
