import Cookies from "js-cookie";
import app_env from "./AppEnv";
import setCookies from "./saveCookies";
const maxRetry = 10;

export const backendCall = (path, data, refreshed, retry) => {
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

    try {
      const response = await fetch(app_env.url.API_URL + path, requestOptions);

      const contentType = response.headers.get("content-type");

      let rsp;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        rsp = await response.json();
        if (rsp.AuthenticationResult && !refreshed) {
          console.log("COOKIES SAVED : ", setCookies(rsp));
          return resolve(await backendCall(path, data, true));
        }
      } else {
        rsp = await response.text();
        return reject(rsp);
      }
      if (response.status > 301 || response.status < 200) {
        return reject(rsp);
      }
      return resolve(rsp);
    } catch (error) {
      console.error("FETCH ERROR ", error.message);
      const tryCount = retry ? retry + 1 : 1;
      if (tryCount < maxRetry) {
        return setTimeout(async () => {
          return resolve(await backendCall(path, data, refreshed, tryCount));
        }, tryCount * 3000);
      }
    }
  });
};
