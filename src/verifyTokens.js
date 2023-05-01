import Cookies from "js-cookie";
import { backendCall } from "./callFetch";
export const verifyToken = () => {
  const body = {
    accessToken: Cookies.get("access-token"),
    idToken: Cookies.get("id-token"),
  };

  return new Promise(async (resolve, reject) => {
    if (!body.accessToken || !body.idToken) return reject("No tokens");

    try {
      await backendCall("/access_token");
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
        Cookies.set("access-token", response.AuthenticationResult.AccessToken, {
          secure: true,
        });
        Cookies.set("id-token", response.AuthenticationResult.IdToken, {
          secure: true,
        });
      }
      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
};
