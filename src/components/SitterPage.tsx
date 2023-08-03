import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import serverUrl from "../config/serverUrl";

interface Request {
  care_type: string;
  created_at: string;
  id: number;
  image_path: string;
  message: string;
  pet: string;
  sitter: string;
  status: string | null;
  user: string;
}

const SitterPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);

  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const userName = localStorage.getItem("name");

  //AUTHENTICATION
  useEffect(() => {
    fetch(`${serverUrl}/sitter`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.Login && type === "sitter") {
          console.log(data);
        } else if (data.Login && type === "customer") {
          navigate("/customer");
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  //REQUESTS LIST
  useEffect(() => {
    fetch(
      `${serverUrl}/sitter/requests`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const userName = localStorage.getItem("name");
        const req = data.userRequests;
        const userRequest = req[0].filter(
          (user: Request) => user.sitter === userName
        );
        if (userRequest) {
          setRequests(userRequest);
        } else {
          return;
        }
      })
      .catch((error) => console.log(error));
  }, []);

  //POST ANSWER
  const requestAnswerHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const answer = e.currentTarget.value;
    const request_id = e.currentTarget.name;

    fetch(
      `${serverUrl}/sitter/request_answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer, request_id }),
      }
    )
      .then((response) => {
        if (response.ok) {
          const updatedRequests = requests.map((request) =>
            request.id.toString() === request_id
              ? { ...request, status: answer }
              : request
          );
          setRequests(updatedRequests);
          return response.text();
        } else if (response.status === 400) {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-col relative top-36">
        <h1 className="text-center text-2xl text-stroke-1-white font-caprasimo">
          Welcome {userName}!
        </h1>

        {requests.length === 0 ? (
          <div className="relative top-64 text-center text-3xl text-white">
            <p>NO REQUESTS FOUND</p>
          </div>
        ) : (
          <div>
            {requests.map((request) => (
              <div
                className="flex flex-col justify-center items-start mx-auto my-10
                w-[80vw] md:w-[40rem] p-5 bg-blue-300 rounded-md border-4 border-blue-950"
                key={request.created_at}
              >
                {request.image_path ? (
                  <img
                    className="mx-auto mb-2 rounded-xl w-40 h-40 object-cover border-2 border-blue-950"
                    src={`${serverUrl}/${request.image_path.slice(7)}`}
                    alt="picture of the pet"
                  />
                ) : null}
                <p>
                  <strong>Service:</strong> {request.care_type}
                </p>
                <p>
                  <strong>Pet:</strong> {request.pet}
                </p>
                <p>
                  <strong>Customer:</strong> {request.user}
                </p>
                {request.message ? (
                  <p>
                    <strong>Message:</strong>
                    <em>"{request.message}"</em>
                  </p>
                ) : null}
                <p>
                  <strong>Date of request:</strong>{" "}
                  {request.created_at
                    ? new Date(request.created_at.slice(0, 10))
                        .toLocaleDateString()
                        .split("-")
                        .reverse()
                        .join("/")
                    : "N/A"}
                </p>
                {request.status === "accepted" ? (
                  <p className="mt-2 text-green-600 font-bold">ACCEPTED</p>
                ) : request.status === "rejected" ? (
                  <p className="mt-2 text-red-500 font-bold">REJECTED</p>
                ) : (
                  <div className="mx-auto -mb-5">
                    <button
                      onClick={requestAnswerHandler}
                      className="btn-accept"
                      name={request.id.toString()}
                      value="accepted"
                    >
                      <strong>ACCEPT</strong>
                    </button>
                    <button
                      onClick={requestAnswerHandler}
                      className="btn-reject"
                      name={request.id.toString()}
                      value="rejected"
                    >
                      <strong>REJECT</strong>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SitterPage;
