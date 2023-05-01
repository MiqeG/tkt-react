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
      return resolve(await backendCall("/access_token"));
    } catch (error) {
      console.error("TOKEN ERROR :", error);
      return reject(error);
    }
  });
};
