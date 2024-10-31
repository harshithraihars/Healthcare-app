const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  docId:{type:String,required:true,unique:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
});

// Hash the password before saving the doctor
doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export the Doctor model
module.exports = mongoose.model("Doctor", doctorSchema);
