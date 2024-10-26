import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css";
import Mainheader from "./Mainheader";

const Events = () => {
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
  });
  const [requestFormData, setRequestFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    requestedBy: "",
  });
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);

  const handleAddEventClick = () => {
    setShowForm(true);
    setShowRequestForm(false);
  };

  const handleRequestEventClick = () => {
    setShowRequestForm(true);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestFormData({
      ...requestFormData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        formData
      );
      console.log("Event created:", response.data);
      setShowForm(false);
      setFormData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        eventDescription: "",
      });
      fetchEvents();
    } catch (error) {
      console.error("There was an error creating the event!", error);
    }
  };

  const handleRequestFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/request-event",
        requestFormData
      );
      console.log("Event request submitted:", response.data);
      setShowRequestForm(false);
      setRequestFormData({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        requestedBy: "",
      });
      fetchRequests();
    } catch (error) {
      console.error("There was an error submitting the event request!", error);
    }
  };
  const fetchEmail = async () => {
    axios.get("http://localhost:5000/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
        console.log(role);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/request-event");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/approve-event", {
        _id: id,
      });
      if (response.status === 200) {
        setRequests(requests.filter((request) => request._id !== id));
        fetchEvents();
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/decline-event", {
        _id: id,
      });
      if (response.status === 200) {
        setRequests(requests.filter((request) => request._id !== id));
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRequests();
  }, []);

  return (
    <div className="events-container">
      <Mainheader />
      <h1>Gaming Society Events</h1>
      <div className="events-options">
        {(role === "President" || role === "Head" || role === "Vice Head") && (
          <button onClick={handleAddEventClick}>Add Event</button>
        )}
        {(role === "User" || role === "Member") && (
          <button onClick={handleRequestEventClick}>Request Event</button>
        )}
      </div>

      {showForm && (
        <form className="event-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventTime">Event Time:</label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventLocation">Event Location:</label>
            <input
              type="text"
              id="eventLocation"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Event Description:</label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button type="submit">Create Event</button>
        </form>
      )}

      {showRequestForm && (
        <form className="event-form" onSubmit={handleRequestFormSubmit}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={requestFormData.eventName}
              onChange={handleRequestInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Event Description:</label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={requestFormData.eventDescription}
              onChange={handleRequestInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={requestFormData.eventDate}
              onChange={handleRequestInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="requestedBy">Requested By:</label>
            <input
              type="text"
              id="requestedBy"
              name="requestedBy"
              value={requestFormData.requestedBy}
              onChange={handleRequestInputChange}
              required
            />
          </div>
          <button type="submit">Submit Request</button>
        </form>
      )}

      {!showForm && !showRequestForm && (
        <div className="events-list">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.eventName}</h3>
                <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                <p>Time: {event.eventTime}</p>
                <p>Location: {event.eventLocation}</p>
                <p>Description: {event.eventDescription}</p>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      )}
      <br />
      {(role === "President" || role === "Head") && (
        <div className="pending-requests">
          <h2>Pending Event Requests</h2>
          <ul>
            {requests.length > 0 ? (
              requests.map((request) => (
                <li key={request._id}>
                  <p>{request.eventName}</p>
                  <p>{request.eventDescription}</p>
                  <p>{new Date(request.eventDate).toLocaleDateString()}</p>
                  <p>Requested By: {request.requestedBy}</p>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleDecline(request._id)}
                  >
                    Decline
                  </button>
                </li>
              ))
            ) : (
              <p>No pending requests found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Events;
