import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Announcements.css"; // Ensure this CSS file exists
import Mainheader from "./Mainheader";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null); // For tracking which announcement is being edited
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");

  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/announcements");
      if (Array.isArray(response.data)) {
        setAnnouncements(response.data);
      } else {
        console.error("Fetched data is not an array:", response.data);
        setAnnouncements([]); // Fallback to empty array if not an array
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]); // Ensure announcements is always an array
    }
  };

  // Fetch announcements when component mounts
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAnnouncement = { title, message };
      await axios.post("http://localhost:5000/announcements", newAnnouncement);
      setAnnouncements((prevAnnouncements) => [
        ...prevAnnouncements,
        newAnnouncement,
      ]);
      setTitle("");
      setMessage("");
      alert("Announcement posted successfully!");
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to start editing an announcement
  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setEditTitle(announcement.title);
    setEditMessage(announcement.message);
  };

  // Function to handle the edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAnnouncement = { title: editTitle, message: editMessage };
      await axios.put(
        `http://localhost:5000/announcements/${editingId}`,
        updatedAnnouncement
      );
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement._id === editingId
            ? { ...announcement, ...updatedAnnouncement }
            : announcement
        )
      );
      setEditingId(null);
      setEditTitle("");
      setEditMessage("");
      alert("Announcement updated successfully!");
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Event handlers for input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleEditTitleChange = (e) => setEditTitle(e.target.value);
  const handleEditMessageChange = (e) => setEditMessage(e.target.value);

  return (
    <div className="announcements-page">
      <Mainheader />
      <div className="form-container">
        <form onSubmit={handleSubmit} className="announcement-form">
          <h1>Post an Announcement</h1>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Post Announcement
          </button>
        </form>
      </div>
      <div className="announcements-container">
        <h2>Announcements</h2>
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="announcement">
              <h3>{announcement.title}</h3>
              <p>{announcement.message}</p>
              <small>{new Date(announcement.date).toLocaleString()}</small>
              {/* Edit button conditionally rendered based on user role */}
              {/* Replace `true` with a check for the user's role */}
              {true && (
                <button onClick={() => handleEdit(announcement)}>Edit</button>
              )}
              {editingId === announcement._id && (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <div className="form-group">
                    <label htmlFor="edit-title">Title</label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editTitle}
                      onChange={handleEditTitleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-message">Message</label>
                    <textarea
                      id="edit-message"
                      value={editMessage}
                      onChange={handleEditMessageChange}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    Save Changes
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
