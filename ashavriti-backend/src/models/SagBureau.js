import mongoose from "mongoose";

const sagBureauSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
}, { 
  timestamps: true 
});

const SagBureau = mongoose.model("SagBureau", sagBureauSchema);
export default SagBureau;