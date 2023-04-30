import Cookies from "js-cookie";
import app_env from "./AppEnv";

export const backendCall = (path, data) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cognito-Access-Token": Cookies.get("access-token"),
        "Cognito-Refresh-Token": Cookies.get("refresh-token"),
        "Cognito-Id-Token": Cookies.get("id-token"),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(app_env.url.API_URL + path, requestOptions);
    const contentType = response.headers.get("content-type");
    let rsp;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      rsp = await response.json();
    } else rsp = await response.text();
    if (response.status > 301 || response.status < 200) return reject(rsp);
    else return resolve(rsp);
  });
};
