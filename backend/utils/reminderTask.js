const cron = require("node-cron");
const eventSchema = require("../model/eventSchema");
const userSchema = require("../model/userSchema");
const reminderSchema = require("../model/reminderSchema");
const sendEmail = require("./sendEmail");

/**
 * Initialize the reminder cron job
 * Runs every 15 minutes
 */
const initReminderTask = () => {
    console.log("⏰ Reminder task initialized. Running every 15 minutes.");

    cron.schedule("*/15 * * * *", async () => {
        try {
            const now = new Date();
            console.log(`[ReminderTask] Checking for upcoming events at ${now.toISOString()}`);

            // Fetch events starting in the future
            const upcomingEvents = await eventSchema.find({
                date: { $gte: now }
            }).populate('registeredUsers');

            for (const event of upcomingEvents) {
                const eventDate = new Date(event.date);

                // Parse startTime (assumed HH:MM format) if needed, but event.date should represent the day.
                // If event.date is just the day, we might need to combine with startTime.
                // Looking at eventSchema, startTime is a string. Assuming "HH:mm".

                let eventFullDate = new Date(eventDate);
                if (event.startTime) {
                    const [hours, minutes] = event.startTime.split(':');
                    eventFullDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                }

                const diffMs = eventFullDate - now;
                const diffHours = diffMs / (1000 * 60 * 60);

                // Milestones
                let reminderType = null;
                if (diffHours > 71 && diffHours <= 72.25) { // ~3 days (approx window for 15 min cron)
                    reminderType = '3_days';
                } else if (diffHours > 23 && diffHours <= 24.25) { // ~24 hours
                    reminderType = '24_hours';
                } else if (diffHours > 0 && diffHours <= 1.25) { // ~1 hour
                    reminderType = '1_hour';
                }

                if (reminderType) {
                    for (const userId of event.registeredUsers) {
                        await sendReminder(userId, event, reminderType);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Reminder task error:", error);
        }
    });
};

/**
 * Helper to send reminder if not already sent
 */
const sendReminder = async (userRef, event, type) => {
    try {
        const userId = userRef._id || userRef;

        // Check if already sent
        const alreadySent = await reminderSchema.findOne({
            userId,
            eventId: event._id,
            reminderType: type
        });

        if (alreadySent) return;

        // Get user details
        const user = await userSchema.findById(userId);
        if (!user || !user.email) return;

        let timeDesc = "";
        if (type === '3_days') timeDesc = "in 3 days";
        else if (type === '24_hours') timeDesc = "in 24 hours (tomorrow!)";
        else if (type === '1_hour') timeDesc = "in 1 hour!";

        const subject = `🔔 Reminder: ${event.name} is starting ${timeDesc}`;
        const body = `Hello ${user.fullName || user.username},\n\nThis is a reminder that the event "${event.name}" you booked is starting ${timeDesc}.\n\n📅 Date: ${event.date.toDateString()}\n⏰ Time: ${event.startTime} - ${event.endTime}\n📍 Location: ${event.place}\n\nWe look forward to seeing you there!`;

        await sendEmail(user.email, subject, body);

        // Record as sent
        await reminderSchema.create({
            userId,
            eventId: event._id,
            reminderType: type
        });

        console.log(`✅ ${type} reminder sent to ${user.email} for event ${event.name}`);
    } catch (error) {
        // Unique index might catch race conditions, but we use findOne anyway.
        if (error.code !== 11000) {
            console.error(`❌ Error sending ${type} reminder for event ${event._id}:`, error);
        }
    }
};

module.exports = initReminderTask;
