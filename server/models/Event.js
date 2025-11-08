import mongoose from 'mongoose';

const updateLogSchema = new mongoose.Schema(
  {
    field: String,
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    updatedAt: Date,
    updatedBy: String,
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
    },
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    timezone: {
      type: String,
      default: 'UTC',
    },
    startDate: Date,
    endDate: Date,
    updateHistory: [updateLogSchema],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;