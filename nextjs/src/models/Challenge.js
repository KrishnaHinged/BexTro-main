import mongoose from "mongoose";

const singleChallengeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    objective: {
        type: String,
        trim: true,
        default: "Take a meaningful step forward"
    },
    motivation: {
        type: String,
        trim: true,
        default: "You're building momentum!"
    },
    benefits: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ["General", "Personal", "Professional", "Adventure", "Creative", "Health", "Learning"],
        default: "General"
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    source: {
        type: String,
        enum: ["AI", "User", "Curated"],
        default: "AI"
    },
    usedByCount: {
        type: Number,
        default: 0
    },
    completedByCount: {
        type: Number,
        default: 0
    },
    createdFromInterests: [String],
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Avoid model recompilation errors
const Challenge = mongoose.models.Challenge || mongoose.model("Challenge", singleChallengeSchema);

Challenge.schema.index({ text: 1 }, { unique: true });
Challenge.schema.index({ category: 1, difficulty: 1, usedByCount: -1 });

export default Challenge;
