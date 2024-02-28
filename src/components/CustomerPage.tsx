import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { TbDog } from "react-icons/tb";
import { TbCat } from "react-icons/tb";
import { GiHouse } from "react-icons/gi";
import { MdPets } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import ClipLoader from "react-spinners/ClipLoader";

import NavBar from "./NavBar";
import serverUrl from "../config/serverUrl";

interface Sitter {
  id: number;
  first_name: string;
  last_name: string;
  summary: string;
  hour_rate: string;
  day_rate: string;
}

interface RequestData {
  pet: string;
  care: string;
  sitter: string;
  message: string;
}

const CustomerPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const userName = localStorage.getItem("name");

  const [loading, setLoading] = useState<boolean>(false);
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [requestData, setRequestData] = useState<RequestData>({
    pet: "",
    care: "",
    sitter: "",
    message: "",
  });

  //AUTHENTICATION
  useEffect(() => {
    fetch(`${serverUrl}/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.Login && type === "customer") {
          console.log(data);
        } else if (data.Login && type === "sitter") {
          navigate("/sitter");
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  //LIST OF SITTERS
  useEffect(() => {
    fetch(`${serverUrl}/customer/sitters`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSitters(data.existingSitter[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  //DISPLAY UPLOADED IMAGE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  //HANDLING DATA
  const dataHandler = (
    e:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRequestData({
      ...requestData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const formData = new FormData();
  if (userName) {
    formData.append("user", userName);
  }

  formData.append("pet", requestData.pet);
  formData.append("care", requestData.care);
  formData.append("sitter", requestData.sitter);
  formData.append("message", requestData.message);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  //POST IN DATABASE
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    fetch(`${serverUrl}/customer/post`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setLoading(false);
        if (response.ok) {
          return response.text();
        } else if (response.status === 400) {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        setLoading(false);
        navigate("/customer/requests")
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {/* Loading... */}
      {loading ? (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center 
      justify-center overflow-y-scroll z-50 border-b-[1rem] border-b-gray-800 border-opacity-10"
        >
          <ClipLoader color="#36d7b7" loading size={64} />
        </div>
      ) : null}

      <NavBar />
      <form
        onSubmit={submitHandler}
        className="relative top-36 flex flex-col items-center"
      >
        <h1 className="font-caprasimo text-stroke-1-white mb-28 text-2xl">
          Welcome {userName}!
        </h1>

        <section className="mb-20">
          <p className="font-title font-bold text-center">
            Who's being booked for?
          </p>
          <label className="relative inline-flex items-center">
            <div className="btn-pet">
              <TbDog size={80} />
            </div>
            <input
              onChange={dataHandler}
              className="input-pet"
              type="radio"
              name="pet"
              id="dog"
              value="dog"
              required
            />
          </label>
          <label className="relative inline-flex items-center">
            <div className="btn-pet">
              <TbCat size={80} />
            </div>
            <input
              onChange={dataHandler}
              className="input-pet"
              type="radio"
              name="pet"
              id="cat"
              value="cat"
              required
            />
          </label>
        </section>

        <section className="mb-28 py-20 px-[8vw] flex flex-col items-center shadow-inner bg-gray-100 rounded-3xl">
          <p className="mb-6 font-bold font-title text-black text-center">
            Share a picture of your pet
          </p>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="my-4 w-40 h-40 object-cover rounded-xl"
            />
          )}

          <label
            className="flex flex-col justify-center items-center w-64 h-10 bg-blue-950 rounded-md 
          overflow-hidden text-white hover:cursor-pointer hover:bg-blue-500"
          >
            <p>Upload File</p>
            <input
              onChange={handleFileChange}
              className="w-0 h-0 cursor-pointer"
              type="file"
              id="image"
              name="image"
              accept="image/*"
            />
          </label>
        </section>

        <section className="mb-20">
          <p className="font-title font-bold text-center">
            Daycare or dog walking?
          </p>
          <label className="relative inline-flex items-center">
            <div className="btn-pet">
              <GiHouse size={80} />
            </div>
            <input
              onChange={dataHandler}
              className="input-pet"
              type="radio"
              name="care"
              id="daycare"
              value="daycare"
              required
            />
          </label>
          <label className="relative inline-flex items-center">
            <div className="btn-pet">
              <MdPets size={80} />
            </div>
            <input
              onChange={dataHandler}
              className="input-pet"
              type="radio"
              name="care"
              id="walk"
              value="walk"
              required
            />
          </label>
        </section>

        <label className="mb-6 font-title font-bold">Choose a sitter</label>
        {sitters.length === 0 ? (
          <section className="h-64 flex items-center">
            <div className="relative text-center text-xl h-20 bg-green-300 flex items-center px-5 rounded-xl">
              <p>NO SITTERS REGISTERED</p>
            </div>
          </section>
        ) : (
          <section className="mb-20 flex flex-col overflow-y-hidden overflow-scroll items-center w-full sm:w-[70vw] h-[30rem]">
            <div className="flex w-full">
              {sitters.map((sitter) => (
                <label
                  className="relative inline-flex items-center"
                  key={sitter.id}
                >
                  <div className="mt-4 mx-2 p-6 w-[22.5rem] h-[28rem] flex flex-col items-center rounded-3xl bg-green-300">
                    <div className="mb-3 flex flex-col items-center">
                      <BsPersonCircle size={150} />
                      <p className="mt-6">
                        {sitter.first_name} {sitter.last_name}
                      </p>
                    </div>
                    <div className="mt-2 flex font-bold italic text-sm">
                      <p className="mr-3">
                        <span className="font-normal">Hour rate:</span> $
                        {sitter.hour_rate}
                      </p>
                      <p>
                        <span className="font-normal">Day rate:</span> $
                        {sitter.day_rate}
                      </p>
                    </div>
                    <div className="mt-3 italic text-center">
                      "{sitter.summary}"
                    </div>
                  </div>
                  <input
                    onChange={dataHandler}
                    className="appearance-none w-[22.5rem] h-[28rem] rounded-3xl absolute translate-y-2 left-1/2 -translate-x-1/2 bg-transparent
                  hover:bg-green-950 hover:opacity-50 hover:cursor-pointer 
                  checked:border-8 checked:border-yellow-300"
                    type="radio"
                    name="sitter"
                    id={sitter.last_name}
                    value={sitter.first_name}
                    required
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 flex flex-col items-center">
          <label className="font-title font-bold mb-6" htmlFor="message">
            Leave them a message
          </label>
          <textarea
            onChange={dataHandler}
            className="pl-1 indent-4 rounded-md w-[90vw] sm:w-[35rem] h-52 drop-shadow-2xl"
            name="message"
            id="message"
            rows={10}
            minLength={10}
            maxLength={220}
            placeholder="Tell them a bit about your pet..."
          ></textarea>
        </section>

        <button className="btn-submit" type="submit">
          Send request
        </button>
      </form>
      <Outlet />
    </div>
  );
};

export default CustomerPage;
