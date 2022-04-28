import mongoose from 'mongoose';

const schema = mongoose.Schema;

const barSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  shipBar: {
    type: String,
    required: [true, "projectname field is required"],
  },

 
});

const User = mongoose.model("bar", barSchema);
 export default User;