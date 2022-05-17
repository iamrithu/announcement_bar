import mongoose from "mongoose";

const schema = mongoose.Schema;

const barSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  shipBar: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  fontColor: {
    type: String,
    required: true,
  },
  fontFamily: {
    type: String,
    required: true,
  },
  fontSize: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },

  isActive: { type: Boolean, default: false },
});

const User = mongoose.model("bar", barSchema);
export default User;
