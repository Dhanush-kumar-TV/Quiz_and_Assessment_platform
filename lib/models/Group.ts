import { Schema, model, models } from 'mongoose';

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Group = models.Group || model('Group', GroupSchema);

export default Group;
