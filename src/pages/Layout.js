import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import React, { useEffect } from "react";
import loader from "../audio.svg";
import Cookies from "js-cookie";
import { backendCall } from "../callFetch";
const Layout = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    window.addEventListener("load", handleLoading());
  }, []);

  const handleLoading = async () => {
    setTimeout(async () => {
      try {
        await verifyToken();
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        return (window.location.href = "/logout");
      }
    }, 100);
  };
  return !isLoading ? (
    <>
      <Menu />
      <Outlet />
    </>
  ) : (
    <div className="loader_image ui container">
      {<img className="loader_image" src={loader} alt="loader" />}
    </div>
  );
};

export default Layout;
const verifyToken = () => {
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
      await refreshToken();
    }
  });
};
const refreshToken = () => {
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
