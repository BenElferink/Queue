import mongoose from 'mongoose';

const instance = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    question: String,
    answer: String,
    answered: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // this creates and maintains:
    // {
    //   createdAt: Date,
    //   updatedAt: Date,
    // }
  },
);

// NOTE! use a singular model name, mongoose automatically creates a collection like so:
// model: 'User' === collection: 'users'
const modelName = 'Quest';

export default mongoose.model(modelName, instance);
