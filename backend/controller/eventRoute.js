const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../model/userSchema");
const eventSchema = require("../model/eventSchema");
const feedbackSchema = require("../model/feedbackSchema");

const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const eventRoute = express.Router();

// ------------------------- Auth Routes -------------------------

// ✅ Register User (Hashing is handled by pre-save hook in userSchema)
eventRoute.post("/create-user", async (req, res) => {
    try {
        // Check if username already exists
        const existingUser = await userSchema.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const newUser = await userSchema.create(req.body);

        // Trigger Registration Email
        if (newUser.email) {
            sendEmail(
                newUser.email,
                "👋 Welcome to Event Management!",
                `Hello ${newUser.fullName || newUser.username},\n\nYour account has been created successfully. You can now log in and book events!`
            ).catch(err => console.error("Email queue error:", err));
        }

        // Important: Do not send the password hash back in the response
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login User
eventRoute.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Trigger Login Email
        if (user.email) {
            sendEmail(
                user.email,
                "✅ Successful Login - Event Management",
                `Hello ${user.fullName || user.username},\n\nYou have successfully logged into your account.`
            ).catch(err => console.error("Email queue error:", err));
        }

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ------------------------- User Routes (Protected) -------------------------

// ✅ Get User List (Admin Only)
eventRoute.get("/user-list", [authMiddleware.verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const users = await userSchema.find()
            .skip(skip)
            .limit(limit)
            .select("-password"); // Exclude password from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get single user details (for profile page)
eventRoute.get("/get-user/:id", authMiddleware.verifyToken, async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get a user's booked events
eventRoute.get("/user-booked-events", authMiddleware.verifyToken, async (req, res) => {
    try {
        console.log("Fetching booked events for user:", req.user.id); // DEBUG
        const user = await userSchema.findById(req.user.id).populate('bookedEvents');
        if (!user) {
            console.log("User not found for booked events"); // DEBUG
            return res.status(404).json({ error: "User not found" });
        }
        console.log("Booked events found:", user.bookedEvents?.length || 0); // DEBUG
        res.json(user.bookedEvents);
    } catch (err) {
        console.error("Error fetching booked events:", err); // DEBUG
        res.status(500).json({ error: err.message });
    }
});


// ✅ Update User
eventRoute.put("/update-user/:id", authMiddleware.verifyToken, async (req, res) => {
    // A user can update their own profile, or an admin can update any profile.
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const updatedData = { ...req.body };
        // If password is being updated, it needs to be hashed.
        if (updatedData.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(updatedData.password, salt);
        } else {
            // Do not update the password if it's not provided
            delete updatedData.password;
        }

        const updatedUser = await userSchema.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete User (Admin Only)
eventRoute.delete("/delete-user/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], async (req, res) => {
    try {
        const deletedUser = await userSchema.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ------------------------- Event Routes -------------------------

// ✅ Get Events with Pagination (Publicly accessible, but booking requires login)
eventRoute.get("/event-list", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const events = await eventSchema.find()
            .skip(skip)
            .limit(limit)
            .select("name date startTime endTime place club description slots createdBy"); // registeredUsers should be protected
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Create Event (Authenticated Users)
eventRoute.post("/create-event", authMiddleware.verifyToken, async (req, res) => {
    try {
        console.log("Create Event Request Body:", req.body); // DEBUG
        console.log("User creating event:", req.user.id); // DEBUG

        const eventData = { ...req.body, createdBy: req.user.id }; // Add creator ID
        const newEvent = await eventSchema.create(eventData);
        console.log("Event created successfully:", newEvent); // DEBUG

        // Trigger Event Creation Email
        if (req.user.email) {
            sendEmail(
                req.user.email,
                "🎉 Event Created Successfully",
                `Hello,\n\nYour event "${newEvent.name}" has been created successfully for ${newEvent.date}.`
            ).catch(err => console.error("Email queue error:", err));
        }

        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Error creating event:", err); // DEBUG
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update Event (Admin OR Owner)
eventRoute.put("/update-event/:id", authMiddleware.verifyToken, async (req, res) => {
    try {
        const event = await eventSchema.findById(req.params.id).populate("createdBy");
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check if user is Admin OR the one who created the event
        if (req.user.role !== 'admin' && event.createdBy?._id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied. You can only update your own events." });
        }

        const updatedEvent = await eventSchema.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        // Trigger Update Email
        if (event.createdBy && event.createdBy.email) {
            sendEmail(
                event.createdBy.email,
                "📝 Event Updated Successfully",
                `Hello,\n\nYour event "${event.name}" has been updated successfully.`
            ).catch(err => console.error("Email queue error:", err));
        }

        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete Event (Admin OR Owner)
eventRoute.delete("/delete-event/:id", authMiddleware.verifyToken, async (req, res) => {
    try {
        const event = await eventSchema.findById(req.params.id).populate("createdBy");
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check if user is Admin OR the one who created the event
        if (req.user.role !== 'admin' && event.createdBy?._id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied. You can only delete your own events." });
        }

        await eventSchema.findByIdAndDelete(req.params.id);

        // Trigger Deletion Email
        if (event.createdBy && event.createdBy.email) {
            sendEmail(
                event.createdBy.email,
                "🗑️ Event Deleted Successfully",
                `Hello,\n\nYour event "${event.name}" has been deleted from the system.`
            ).catch(err => console.error("Email queue error:", err));
        }

        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Single Event by ID
eventRoute.get("/get-event/:id", async (req, res) => {
    try {
        const event = await eventSchema.findById(req.params.id).populate('registeredUsers', 'username fullName');
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Book an Event (Authenticated Users)
eventRoute.post("/book-event/:eventId", authMiddleware.verifyToken, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await eventSchema.findById(eventId);
        const user = await userSchema.findById(userId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        if (event.slots <= 0) {
            return res.status(400).json({ error: "Event is full" });
        }
        if (user.bookedEvents.includes(eventId)) {
            return res.status(400).json({ error: "Event already booked" });
        }

        // Atomic update
        event.slots -= 1;
        event.registeredUsers.push(userId);
        await event.save();

        user.bookedEvents.push(eventId);
        await user.save();

        res.status(200).json({ message: "Event booked successfully" });

    } catch (err) {
        res.status(500).json({ error: "Server error during booking process." });
    }
});

// ✅ Cancel Booking (Authenticated Users)
eventRoute.post("/cancel-booking/:eventId", authMiddleware.verifyToken, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log(`[CANCEL] Request received for event: ${eventId}, user: ${userId}`); // DEBUG

    try {
        const event = await eventSchema.findById(eventId);
        const user = await userSchema.findById(userId);

        if (!event) {
            console.log("[CANCEL] Event not found"); // DEBUG
            return res.status(404).json({ error: "Event not found" });
        }
        if (!user) {
            console.log("[CANCEL] User not found"); // DEBUG
            return res.status(404).json({ error: "User not found" });
        }

        console.log("[CANCEL] Current booked events:", user.bookedEvents); // DEBUG

        // Check if booked - Ensure type matching (string vs ObjectId)
        const isBooked = user.bookedEvents.some(id => id.toString() === eventId);
        if (!isBooked) {
            console.log("[CANCEL] User has not booked this event"); // DEBUG
            return res.status(400).json({ error: "You have not booked this event" });
        }

        // Remove from event
        event.slots += 1;
        event.registeredUsers = event.registeredUsers.filter(id => id.toString() !== userId);
        await event.save();

        // Remove from user
        user.bookedEvents = user.bookedEvents.filter(id => id.toString() !== eventId);
        await user.save();

        console.log("[CANCEL] Cancellation successful"); // DEBUG

        // Trigger Booking Cancellation Email
        if (user.email) {
            sendEmail(
                user.email,
                "⚠️ Booking Cancelled",
                `Hello ${user.fullName || user.username},\n\nYour booking for the event "${event.name}" has been cancelled successfully.`
            ).catch(err => console.error("Email queue error:", err));
        }

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("[CANCEL] Error cancelling booking:", err); // DEBUG
        res.status(500).json({ error: "Server error during cancellation." });
    }
});


// ------------------------- Feedback Routes -------------------------

// ✅ Post Feedback (Public)
eventRoute.post("/post-feedback", async (req, res) => {
    try {
        const newFeedback = await feedbackSchema.create(req.body);
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = eventRoute;