import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import React, { useEffect } from "react";
import loader from "../audio.svg";
import { verifyToken } from "../verifyTokens";
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
        console.error("TOKEN ERROR", error);
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
