import { FcHighPriority } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface UserData {
  email: string;
  password: string;
}

const SignIn = () => {
  //Is the user authenticated already?
  useEffect(() => {
    if (localStorage.getItem("type") === "customer") {
      navigate("/customer");
    } else if (localStorage.getItem("type") === "sitter") {
      navigate("/sitter");
    } else {
      return;
    }
  }, []);

  const [userExists, setUserExists] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const userDataHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(
      "https://mysql-pet-sitting-service-app-b863b223688c.herokuapp.com/log-in",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          setUserExists(true);
          throw new Error("Email or password wrong");
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        if (data.Login) {
          localStorage.setItem("token", data.token);
          if (data.registeredUser !== undefined) {
            localStorage.setItem("type", data.registeredUser[0][0].type);
            localStorage.setItem("name", data.registeredUser[0][0].first_name);
            navigate("/customer");
          } else if (data.registeredSitter !== undefined) {
            localStorage.setItem("type", data.registeredSitter[0][0].type);
            localStorage.setItem(
              "name",
              data.registeredSitter[0][0].first_name
            );
            navigate("/sitter");
          }
        } else {
          setUserExists(true);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="h-screen">
      <div className="relative top-[10vh]">
        <h1
          className="font-caprasimo text-[10vw] min-[650px]:text-7xl text-yellow-300 text-stroke-2-black
        mx-auto mb-8 text-center"
        >
          Find a sitter.
          <br /> Become a bitch.
        </h1>
        <div className=" mx-auto p-5 w-[90vw] min-[450px]:w-96 rounded-3xl bg-white bg-opacity-80">
          <h1 className="mb-6 mt-2 font-bold text-lg">
            Sign in to your account
          </h1>
          {userExists ? (
            <div className="mx-auto mb-4 px-2 flex items-center bg-red-200 h-20 w-72 rounded-md">
              <FcHighPriority size={40} />
              <p className="text-sm text-center">
                What you've entered doesn't match our records. Please try again.
              </p>
            </div>
          ) : null}
          <form onSubmit={submitHandler}>
            <section className="flex flex-col">
              <div className="flex flex-col">
                <label className="flex" htmlFor="email">
                  Email
                </label>
                <input
                  onChange={userDataHandler}
                  className="input-main"
                  type="email"
                  name="email"
                  id="email"
                  required
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="flex" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={userDataHandler}
                  className="input-main"
                  type="password"
                  name="password"
                  id="password"
                  required
                />
              </div>
              <button className="btn-main" type="submit">
                Sign in
              </button>
            </section>
          </form>
          <section className="flex justify-center text-sm">
            <p>Doesn't have an account?&nbsp;</p>
            <Link className="text-blue-500 hover:text-blue-900" to="/signup">
              Sign up
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
