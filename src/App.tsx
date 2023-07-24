import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CustomerPage from "./components/CustomerPage";
import SitterPage from "./components/SitterPage";
import CustomerRequests from "./components/CustomerRequests";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/customer" element={<CustomerPage />}>
          <Route path="/customer/requests" element={<CustomerRequests />} />
        </Route>
        <Route path="/sitter" element={<SitterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//!!!!!!!!!!!!!!!!!!!!CHANGE TITLE!!!!!!!!!!!!!!!!!!!!
//change display when no sitters in database
//check image upload
