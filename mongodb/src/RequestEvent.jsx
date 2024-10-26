// src/RequestEvent.jsx

import React, { useState } from "react";

function RequestEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [requestedBy, setRequestedBy] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/request-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        eventDescription,
        eventDate,
        requestedBy,
      }),
    });

    if (response.ok) {
      alert("Event request submitted successfully!");
      setEventName("");
      setEventDescription("");
      setEventDate("");
      setRequestedBy("");
    } else {
      alert("Failed to submit event request.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Event Name:</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Event Description:</label>
        <input
          type="text"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Event Date:</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Requested By:</label>
        <input
          type="text"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Request</button>
    </form>
  );
}

export default RequestEvent;
