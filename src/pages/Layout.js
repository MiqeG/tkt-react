import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import React, { useEffect } from "react";
import loader from "../audio.svg";

const Layout = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
  const handleLoading = () => {
    setIsLoading(false);
  };
  return !isLoading ? (
    <>
      <Menu />
      <Outlet />
    </>
  ) : (
    <div className="loader_image">
      {<img class="loader_image" src={loader} alt="loader" />}
    </div>
  );
};

export default Layout;
