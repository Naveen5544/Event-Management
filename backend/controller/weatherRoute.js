const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/get-weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = "4e0913dbe3f690b607187273aeb4e30b"; // Use your API key here
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message); // DEBUG
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;