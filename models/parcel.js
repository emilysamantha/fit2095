const mongoose = require("mongoose");

// Mongoose Schema
let parcelSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  sender: String,
  address: String,
  weight: Number,
  fragile: Boolean,
  shipment: {
    type: String,
    validate: {
      validator: function (shipmentValue) {
        return (
          shipmentValue.toLowerCase() === "express" ||
          shipmentValue.toLowerCase() === "standard"
        );
      },
      message: "Shipment should be Express or Standard",
    },
  },
});

module.exports = mongoose.model("Parcel", parcelSchema);
