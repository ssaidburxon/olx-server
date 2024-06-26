const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photos: {
      type: Array,
      default: [],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    run: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    type_of_fuel: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    number_of_hosts: {
      type: String,
      required: true,
    },
    options: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Car", carSchema);