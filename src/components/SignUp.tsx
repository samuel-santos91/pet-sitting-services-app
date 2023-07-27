import { FcHighPriority } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import ClipLoader from "react-spinners/ClipLoader";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  summary: string;
  hourRate: number;
  dayRate: number;
}

const SignUp = () => {
  const navigate = useNavigate();
  const scrollToRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [styleCenter, setStyleCenter] = useState<boolean>(true);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [sitter, setSitter] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "",
    summary: "",
    hourRate: 0,
    dayRate: 0,
  });

  const userDataHandler = (
    e:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserData({
      ...userData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
    if (e.currentTarget.value === "sitter") {
      setSitter(true);
    } else if (e.currentTarget.value === "customer") {
      setSitter(false);
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://pet-sitting-service-app-backend.onrender.com/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        setLoading(false);
        if (response.ok) {
          return response.text();
        } else if (response.status === 400) {
          setUserExists(true);
          throw new Error("Email already exists");
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        setLoading(false);
        navigate("/");
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  //Scroll to view
  useEffect(() => {
    if (sitter) {
      scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sitter]);

  return (
    <div
      className={`${
        styleCenter ? "relative top-1/2 transform -translate-y-1/2" : null
      }  
         my-3 mx-auto p-5 w-[90vw] min-[450px]:w-96 rounded-3xl bg-white bg-opacity-80`}
    >
      {/* Loading... */}
      {loading ? (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center 
      justify-center overflow-y-scroll z-50 border-b-[1rem] border-b-gray-800 border-opacity-10"
        >
          <ClipLoader color="#36d7b7" loading size={64} />
        </div>
      ) : null}

      <h1 className="mb-6 mt-2 font-bold text-lg">Create an account</h1>
      {userExists ? (
        <div className="mx-auto mb-4 px-2 flex items-center bg-red-200 h-20 w-72 rounded-md">
          <FcHighPriority size={40} />
          <p className="text-sm text-center">
            This email already exists in our records. Please try another one.
          </p>
        </div>
      ) : null}
      <form className="mt-5" onSubmit={submitHandler}>
        <section className="flex flex-col">
          <div className="mb-2 flex flex-col">
            <label htmlFor="firstName">First name</label>
            <input
              onChange={userDataHandler}
              className="input-main"
              type="text"
              name="firstName"
              id="firstName"
              required
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label htmlFor="lastName">Last name</label>
            <input
              onChange={userDataHandler}
              className="input-main"
              type="text"
              name="lastName"
              id="lastName"
              required
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              onChange={userDataHandler}
              className="input-main"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              onChange={userDataHandler}
              className="input-main"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          <div className="mt-3">
            <div className="mb-2">
              <input
                onClick={() => {
                  setStyleCenter(true);
                }}
                onChange={userDataHandler}
                className="border-solid border-2 border-blue-950"
                type="radio"
                name="type"
                id="customer"
                value="customer"
                required
              />
              <label className="ml-2" htmlFor="customer">
                I'm a customer
              </label>
            </div>
            <div ref={scrollToRef}>
              <input
                onClick={() => {
                  setStyleCenter(false);
                }}
                onChange={userDataHandler}
                type="radio"
                name="type"
                id="sitter"
                value="sitter"
                required
              />
              <label className="ml-2" htmlFor="sitter">
                I'm a sitter
              </label>
            </div>
          </div>
          {sitter ? (
            <div>
              <div className="flex flex-col my-2">
                <label className="font-bold my-3" htmlFor="summary">
                  About You
                </label>
                <textarea
                  onChange={userDataHandler}
                  className="indent-2 border-solid border-2 border-blue-950 rounded-md h-32"
                  name="summary"
                  id="summary"
                  rows={10}
                  minLength={10}
                  maxLength={220}
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
              <p className="font-bold my-3">Service & Rates</p>
              <div className="flex flex-col mb-2">
                <label htmlFor="hourRate">Hourly rate</label>
                <input
                  onChange={userDataHandler}
                  className="input-main"
                  type="number"
                  id="hourRate"
                  name="hourRate"
                  min="1"
                  step="any"
                  placeholder=" AU$"
                  required
                />
              </div>
              <div className="flex flex-col mb-2">
                <label htmlFor="dayRate">Day care rate</label>
                <input
                  onChange={userDataHandler}
                  className="input-main"
                  type="number"
                  id="dayRate"
                  name="dayRate"
                  min="1"
                  step="any"
                  placeholder=" AU$"
                  required
                />
              </div>
            </div>
          ) : null}
          <button className="btn-main" type="submit">
            Sign up
          </button>
        </section>
      </form>
      <section className="flex justify-center text-sm">
        <Link className="text-blue-500 hover:text-blue-900" to="/">
          Back to main page
        </Link>
      </section>
    </div>
  );
};

export default SignUp;
