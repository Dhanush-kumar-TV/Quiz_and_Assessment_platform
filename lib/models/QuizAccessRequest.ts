import { Schema, model, models } from "mongoose";

const QuizAccessRequestSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
    decidedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// One request per user per quiz (status updates over time)
QuizAccessRequestSchema.index({ quizId: 1, userId: 1 }, { unique: true });

const QuizAccessRequest =
  models.QuizAccessRequest || model("QuizAccessRequest", QuizAccessRequestSchema);

export default QuizAccessRequest;

