import Cookies from "js-cookie";
import loader from "../audio.svg";
const Logout = () => {
  Cookies.remove("access-token");
  Cookies.remove("refresh-token");
  Cookies.remove("id-token");
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
  return (
    <div className="loader_image ui container">
      {<img className="loader_image" src={loader} alt="loader" />}
    </div>
  );
};

export default Logout;
