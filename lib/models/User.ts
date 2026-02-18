import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    theme: { type: String, default: "light" },
    role: { type: String, enum: ['user', 'admin', 'trainer'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
