const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, unique: true, index: true, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    place: { type: String, required: true },
    club: { type: String },
    description: { type: String },
    slots: { type: Number, required: true },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "userSchema" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userSchema" } // Track who created the event
}, { collection: "events-record" });

module.exports = mongoose.model("eventSchema", eventSchema);