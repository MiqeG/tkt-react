import Cookies from "js-cookie";
export default function setCookies(response) {
  if (response.AuthenticationResult) {
    Cookies.set("access-token", response.AuthenticationResult.AccessToken, {
      secure: true,
      expires: 70,
    });
    Cookies.set("id-token", response.AuthenticationResult.IdToken, {
      secure: true,
      expires: 70,
    });
    if (response.AuthenticationResult.RefreshToken) {
      Cookies.set("refresh-token", response.AuthenticationResult.RefreshToken, {
        secure: true,
        expires: 40,
      });
    }
    return true;
  }
  return false;
}
