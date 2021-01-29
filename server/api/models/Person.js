import mongoose from 'mongoose';

const instance = new mongoose.Schema(
  {
    username: String,
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
const modelName = 'Person';

export default mongoose.model(modelName, instance);
