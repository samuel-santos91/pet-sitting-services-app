import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

interface Request {
  care_type: string;
  created_at: string;
  id: number;
  message: string;
  pet: string;
  sitter: string;
  status: string | null;
  user: string;
}

const CustomerRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [deleteAnimationId, setDeleteAnimationId] = useState<number | null>(
    null
  );

  //LIST REQUESTS
  useEffect(() => {
    fetch(
      "https://mysql-pet-sitting-service-app-b863b223688c.herokuapp.com/customer/requests"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const userName = localStorage.getItem("name");
        const req = data.userRequests;
        const userRequest = req[0].filter(
          (user: Request) => user.user === userName
        );
        if (userRequest) {
          setRequests(userRequest);
        } else {
          return;
        }
      })
      .catch((error) => console.log(error));
  }, []);

  //DELETE REQUEST
  const deleteHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const deleteId = e.currentTarget.id;

    fetch(
      "https://mysql-pet-sitting-service-app-b863b223688c.herokuapp.com/customer/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId }),
      }
    )
      .then((response) => {
        if (response.ok) {
          setDeleteAnimationId(parseInt(deleteId));
          setTimeout(() => {
            const updatedRequests = requests.filter(
              (request) => request.id.toString() !== deleteId
            );
            setRequests(updatedRequests);
          }, 300);
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
    <div
      onClick={() => {
        navigate("/customer");
      }}
      className="fixed inset-0 bg-gray-800 bg-opacity-95 flex items-center 
      justify-center overflow-y-scroll z-50 border-b-[1rem] border-b-gray-800 border-opacity-10"
    >
      {requests.length === 0 ? (
        <div className="relative text-center text-3xl text-white">
          <p>NO REQUESTS FOUND</p>
        </div>
      ) : (
        <div className="h-screen w-full">
          {requests.map((request) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`flex flex-row-reverse justify-center items-start mx-auto my-6
              w-[80vw] md:w-[40rem] p-5 bg-blue-500 rounded-md
              ${deleteAnimationId === request.id ? "animate-disappear" : null}`}
              key={request.created_at}
            >
              <div
                onClick={deleteHandler}
                className="hover:cursor-pointer"
                id={request.id.toString()}
              >
                <TiDelete size={30} />
              </div>
              <div className="w-full">
                <p>
                  <strong>Status:</strong>{" "}
                  {request.status ? (
                    request.status === "accepted" ? (
                      <strong className="text-green-800">
                        {request.status}
                      </strong>
                    ) : (
                      <strong className="text-red-700">{request.status}</strong>
                    )
                  ) : (
                    "ON HOLD"
                  )}
                </p>
                <p>
                  <strong>Requested to:</strong> {request.sitter}
                </p>
                <p>
                  <strong>Service:</strong> {request.care_type}
                </p>
                <p>
                  <strong>Pet:</strong> {request.pet}
                </p>
                <p>
                  <strong>Message:</strong>{" "}
                  <em>"{request.message ? request.message : "none"}"</em>
                </p>
                <p>
                  <strong>Date of request:</strong>{" "}
                  {new Date(request.created_at.slice(0, 10))
                    .toLocaleDateString()
                    .split("-")
                    .reverse()
                    .join("/")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;
