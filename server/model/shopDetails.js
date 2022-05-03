import mongoose from 'mongoose';

const schema = mongoose.Schema;

const shopSchema = new schema({
    shopId: {
        type: String,
        required: true,
      },
  shop: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  }
 
 
});

const Shop = mongoose.model("shop", shopSchema);
 export default Shop;