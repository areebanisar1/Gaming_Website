import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gallery.css";
import Mainheader from "./Mainheader";

const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchEmail = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-role");
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEvents = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api-gallery");
      setEvents(result.data);
      setFeaturedEvents(result.data); // Example: Take the first 5 events as featured
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentEventIndex(
        (prevIndex) => (prevIndex + 1) % featuredEvents.length
      );
    }, 5000); // Change featured event every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [featuredEvents]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a picture first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(result.data);
      fetchEvents(); // Refresh the events list after upload
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const downloadImage = (image) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${image}`;
    link.download = image.split("/uploads").pop(); // Use the filename from the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:5000/download-all";
    link.download = "images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (eventId) => {
    try {
      const result = await axios.post("http://localhost:5000/delete-image", {
        _id: eventId,
      });
      alert(result.data);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="events-container">
      <Mainheader />

      {featuredEvents.length > 0 && (
        <div className="featured-events">
          <div className="featured-event">
            <img
              src={`http://localhost:5000/${featuredEvents[currentEventIndex].image}`}
              alt={featuredEvents[currentEventIndex].name}
              className="featured-image"
            />
          </div>
        </div>
      )}

      <div className="buttons-container">
        {role === "President" && (
          <div>
            <input type="file" id="file-input" onChange={handleFileChange} />
            <label htmlFor="file-input" className="custom-file-input-button">
              Upload Picture
            </label>
          </div>
        )}
        <div className="right-buttons">
          <button className="event-button" onClick={downloadAllImages}>
            Download All
          </button>
        </div>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-card-image-container">
              <img
                src={`http://localhost:5000/${event.image}`}
                alt={event.name}
                className="event-card-image"
              />
              {role === "President" && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(event._id)}
                >
                  ✖
                </button>
              )}
              <button
                className="download-button"
                onClick={() => downloadImage(event.image)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
