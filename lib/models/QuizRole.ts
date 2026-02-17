import mongoose, { Schema, model, models } from 'mongoose';

const QuizRoleSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { 
      type: String, 
      enum: ['creator', 'teacher', 'monitor', 'student'], 
      required: true 
    },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Unique index to ensure a user has only one specific role per quiz
QuizRoleSchema.index({ quizId: 1, userId: 1 }, { unique: true });

const QuizRole = models.QuizRole || model('QuizRole', QuizRoleSchema);

export default QuizRole;
