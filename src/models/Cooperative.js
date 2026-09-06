const mongoose = require("mongoose");

const cooperativeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["federation", "society"],
      default: "society",
    },

    parentFederation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cooperative",
      default: null,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

cooperativeSchema.index({
  state: 1,
  city: 1,
});

cooperativeSchema.index({
  parentFederation: 1,
});

module.exports = mongoose.model("Cooperative", cooperativeSchema);