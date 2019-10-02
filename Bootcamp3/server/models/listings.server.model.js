// You can replace this entire file with your Bootcamp Assignment #2 - ListingSchema.js File

/* Import mongoose and define any variables needed to create the schema */
const mongoose = require('mongoose');

const { Schema } = mongoose;

/* Create your schema */
const listingSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    address: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

/* create a 'pre' function that adds the updated_at and created_at if not already there property */
listingSchema.pre('save', (next) => {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

/* Use your schema to instantiate a Mongoose model */
const Listing = mongoose.model('Listing', listingSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Listing;
