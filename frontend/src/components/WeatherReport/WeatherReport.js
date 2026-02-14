import React, { useState } from "react";
import Axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import "./WeatherReport.css";

function LocationMarker({ setLat, setLon }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLat(e.latlng.lat);
      setLon(e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <span>Mark</span>
    </Marker>
  );
}

// Add prop validation for LocationMarker
LocationMarker.propTypes = {
  setLat: PropTypes.func.isRequired,
  setLon: PropTypes.func.isRequired,
};

export default function WeatherReport() {
  const [place, setPlace] = useState("");
  const [lat, setLat] = useState(16.719264497110537); // Default example
  const [lon, setLon] = useState(81.73604492943052); // Default example
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Geocode place name to lat/lon (using OpenStreetMap Nominatim)
  const findOnMap = async () => {
    try {
      const res = await Axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      if (res.data && res.data.length > 0) {
        setLat(parseFloat(res.data[0].lat));
        setLon(parseFloat(res.data[0].lon));
        setError("");
        setSuccess(""); // Clear success on new search
      } else {
        setError("Place not found");
        setSuccess("");
      }
    } catch {
      setError("Error finding place");
      setSuccess("");
    }
  };

  const getWeather = async () => {
    try {
      const res = await Axios.get("http://localhost:5000/weatherRoute/get-weather", {
        params: { lat, lon },
      });
      setWeather(res.data);
      setError("");
      setSuccess("Weather data fetched successfully!"); // Set success message
    } catch {
      setError("Failed to fetch weather data");
      setWeather(null);
      setSuccess("");
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-content">
        <div className="weather-title-box">
          <h2 className="weather-title">Weather Report</h2>
        </div>

        <div className="search-section">
          <input
            type="text"
            value={place}
            onChange={e => setPlace(e.target.value)}
            placeholder="Enter the location"
            className="weather-input"
          />
          <button className="weather-btn find-btn" onClick={findOnMap}>Find on Map</button>
        </div>

        <p className="instruction-text">Or select a location on the map</p>

        <div className="map-wrapper">
          <MapContainer
            center={[lat, lon]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setLat={setLat} setLon={setLon} />
          </MapContainer>
        </div>

        <div className="coordinates-display">
          <span>Lat: {lat.toFixed(4)}</span>
          <span>Lon: {lon.toFixed(4)}</span>
        </div>

        <button className="weather-btn get-weather-btn" onClick={getWeather}>Get Weather Report</button>

        {error && <div className="weather-error">{error}</div>}
        {success && <div className="weather-success">{success}</div>}

        {weather && (
          <div className="weather-result-card">
            <h3>{weather.name}, {weather.sys.country}</h3>
            <div className="weather-grid">
              <div className="weather-item">
                <span className="label">Temperature</span>
                <span className="value">{Math.round(weather.main.temp)}°C</span>
              </div>
              <div className="weather-item">
                <span className="label">Condition</span>
                <span className="value capitalize">{weather.weather[0].description}</span>
              </div>
              <div className="weather-item">
                <span className="label">Humidity</span>
                <span className="value">{weather.main.humidity}%</span>
              </div>
              <div className="weather-item">
                <span className="label">Wind Speed</span>
                <span className="value">{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}