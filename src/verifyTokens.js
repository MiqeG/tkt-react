import Cookies from "js-cookie";
import { backendCall } from "./callFetch";
import setCookies from "./saveCookies";
export const verifyToken = () => {
  const body = {
    accessToken: Cookies.get("access-token"),
    idToken: Cookies.get("id-token"),
  };

  return new Promise(async (resolve, reject) => {
    if (!body.accessToken || !body.idToken) return reject("No tokens");

    try {
      const response = await backendCall("/access_token");
      if (response.AuthenticationResult) {
        console.log("COOKIES SAVED VERIFY : ", setCookies(response));
      }
      return resolve();
    } catch (error) {
      console.error(error);
    }
  });
};
export const refreshToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await backendCall("/login/refresh_token");

      if (response.AuthenticationResult) {
        console.log("COOKIES SAVED VERIFY : ", setCookies(response));
      }
      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
};
