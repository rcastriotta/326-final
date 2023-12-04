import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  poster_url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  your_comment: {
    type: String,
    required: false,
  },
  your_rating: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([1-5])$/.test(v);
      },
      message: (props) => `${props.value} is not a valid rating!`,
    },
  },
});

const Review = mongoose.model("Review", reviewSchema);
class Database {
  constructor() {}

  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.error("Connection to MongoDB failed:", error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect(process.env.MONGODB_URI);
      console.log("Disconnected successfully from MongoDB");
    } catch (error) {
      console.error("Error while disconnecting from MongoDB:", error);
    }
  }

  async validateObject(obj) {
    try {
      await Review.validate(obj);
      return true;
    } catch {
      return false;
    }
  }
  async getAllReviews() {
    return await Review.find().sort({ updatedAt: -1 });
  }

  async updateReview(id, updateData) {
    await Review.updateOne({ id }, updateData);
  }

  async removeReview(id) {
    await Review.deleteOne({ id });
  }

  async createOrUpdateReview(reviewData) {
    const { id } = reviewData;
    await Review.findOneAndUpdate({ id }, reviewData, { upsert: true });
  }
}

const database = new Database();

export { database };
