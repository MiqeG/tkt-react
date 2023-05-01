import Cookies from "js-cookie";

const Logout = () => {
  Cookies.remove("access-token");
  Cookies.remove("refresh-token");
  Cookies.remove("id-token");
  window.location.href = "/login";
};

export default Logout;
