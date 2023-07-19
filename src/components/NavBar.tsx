import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const logOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("name");
    navigate("/");
  };

  const requestHandler = () => {
    if (localStorage.getItem("type") === "customer") {
      navigate("/customer/requests");
    } else {
      navigate("/sitter/requests");
    }
  };

  return (
    <div className="h-18 bg-black flex justify-end items-center fixed top-0 left-0 w-screen z-50">
      {localStorage.getItem("type") === "sitter" ? null : (
        <button
          onClick={requestHandler}
          className="text-white h-8 hover:text-slate-500"
        >
          My requests
        </button>
      )}
      <button onClick={logOutHandler} className="btn-nav">
        LOG OUT
      </button>
    </div>
  );
};

export default NavBar;
