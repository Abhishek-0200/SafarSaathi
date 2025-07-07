import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  stopOrder: {
    type: Number, // Order of the stop in the route
    required: true,
  },
});

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  stops: [stopSchema], // Array of stops
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
});

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
  },
  route: routeSchema, // Nested route schema
  startingTime: {
    type: String, // e.g., "08:00 AM"
    required: true,
  },
  departureTime: {
    type: String, // e.g., "10:30 AM"
    required: true,
  },
  duration: {
    type: String, // e.g., "2h 30m"
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  driverDetails: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
});

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
