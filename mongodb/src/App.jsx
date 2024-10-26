import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import ForgetPassword from "./ForgetPassword";
import Verification from "./Verification";
import ResetPassword from "./ResetPassword";
import Events from "./Events";
import RequestEvent from "./RequestEvent";
import Gallery from "./Gallery";
import Apply from "./Apply";
import Announcements from "./Announcements";

// import Tasks from "./Tasks";
import TeamsList from "./TeamsList";
import History from "./History";
import Tasks from "./Tasks";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/events" element={<Events />} />
        <Route path="/request-event" element={<RequestEvent />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/team" element={<TeamsList />} />
        {/* <Route path="/task" element={<Tasks />} /> */}
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/history" element={<History />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
