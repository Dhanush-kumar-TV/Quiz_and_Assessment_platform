import mongoose, { Schema, model, models } from 'mongoose';

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [
      {
        type: { type: String, enum: ['multiple-choice', 'picture-choice'], default: 'multiple-choice' },
        questionText: { type: String, required: true },
        options: [
          {
            text: { type: String, required: true },
            image: { type: String, default: "" }, // Base64 or URL
            isCorrect: { type: Boolean, required: true },
          },
        ],
        points: { type: Number, default: 1 },
        required: { type: Boolean, default: false },
        timeLimit: { type: Number, default: 0 }, // in seconds
        category: { type: String, default: "General" },
      },
    ],
    totalPoints: { type: Number, required: true },
    timeLimit: { type: Number, default: 0 }, // in minutes, 0 means no limit
    isPublished: { type: Boolean, default: false },
    showScore: { type: Boolean, default: true },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 0 }, // 0 means unlimited
    emailResults: { type: Boolean, default: false },
    accessType: { type: String, enum: ['public', 'password', 'registration'], default: 'public' },
    password: { type: String, default: "" },
    registrationFields: [{ type: String }], // e.g. ["studentId", "class"]
    publicUrl: { type: String, unique: true },
    embedCode: { type: String },
  },
  { timestamps: true }
);

// Export the model, ensuring we don't re-register it if it already exists
const Quiz = models.Quiz || model('Quiz', QuizSchema);

export default Quiz;
