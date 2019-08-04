import { PATH_LOGIN } from "@/router";

export default function auth({ next, router }) {
  if (!localStorage.getItem("jwt")) {
    return router.push(PATH_LOGIN);
  }

  return next();
}
