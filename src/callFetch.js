import Cookies from "js-cookie";
import app_env from "./AppEnv";

export const backendCall = (path, data, refreshed) => {
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
      if (rsp.AuthenticationResult && !refreshed) {
        Cookies.set("access-token", rsp.AuthenticationResult.AccessToken, {
          secure: true,
        });
        Cookies.set("id-token", rsp.AuthenticationResult.IdToken, {
          secure: true,
        });
        if (rsp.AuthenticationResult.RefreshToken) {
          Cookies.set("refresh-token", rsp.AuthenticationResult.RefreshToken, {
            secure: true,
          });
        }
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
  });
};
