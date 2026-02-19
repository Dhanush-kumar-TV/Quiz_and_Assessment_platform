import { Schema, model, models } from 'mongoose';

const AttemptSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOptionIndex: { type: Number, required: true },
      },
    ],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, required: true },
    completedAt: { type: Date },
    timeTaken: { type: Number, required: true }, // in seconds
    status: { type: String, enum: ['active', 'completed', 'quit'], default: 'active' },
    categoryScores: { type: Map, of: Number, default: {} },
    attemptNumber: { type: Number, default: 1 },
    registrationData: { type: Map, of: String },
  },
  { timestamps: true }
);

const Attempt = models.Attempt || model('Attempt', AttemptSchema);

export default Attempt;
