const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userSchema", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "eventSchema", required: true },
    reminderType: {
        type: String,
        enum: ['3_days', '24_hours', '1_hour'],
        required: true
    },
    sentAt: { type: Date, default: Date.now }
}, { collection: "reminders" });

// Index for quick checking of existing reminders
reminderSchema.index({ userId: 1, eventId: 1, reminderType: 1 }, { unique: true });

module.exports = mongoose.model("reminderSchema", reminderSchema);
