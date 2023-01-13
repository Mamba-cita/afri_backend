const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  name: {
    type: "string",
  },
  container: {
    type: "string",
  },
  size: {
    type: "string",
  },
  weight: {
    type: "string",
  },
  origin: {
    type: "string",
  },
  destination: {
    type: "string",
  },
  empty_return: {
    type: "string",
  },
  description: {
    type: "string",
  },
  receiver: {
    type: "string",
  },
  status: {
    type: "string",
    enum: [
      "Not Allocated",
      "Allocated Waiting Pick-Up",
      "Arrived At Loading Site",
      "Gated In At Loading Site",
      "Loaded Waiting release",
      "On Route To Client",
      "Arrival At Offloading",
      "Offloading",
      "Empty Return Journey",
      "Completed",
    ],
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Client",
  },
});

module.exports = mongoose.model("Job", JobSchema);
