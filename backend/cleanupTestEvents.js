const mongoose = require("mongoose");
const eventSchema = require("./model/eventSchema");

const cleanup = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Management");
        console.log("✅ Connected to DB for cleanup");

        const testEventNames = ["3 Days Event", "24 Hours Event", "1 Hour Event"];
        const result = await eventSchema.deleteMany({ name: { $in: testEventNames } });

        console.log(`🗑️ Deleted ${result.deletedCount} test events.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Cleanup failed:", err);
        process.exit(1);
    }
};

cleanup();
