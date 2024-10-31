const express = require("express");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
const router = express.Router();
const Doctor = require("../models/Doctor");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    if (!name || !email || !password || !specialization)
      return res.status(401).json({ message: "all field are required",success:false  });
    const docId = `DOC_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const doctor = new Doctor({ email, password, name, specialization, docId });
    await doctor.save();
    res.status(201).json({msg:"Registered succefully",docId:docId})
  } catch (error) {
    return res.status(404).json({ msg: error.message,success:false  });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { docId, password } = req.body;
    console.log(docId,password);
    
    if (!docId || !password)
      return res.status(401).json({ message: "all field are required",success:false  });
    const doctor = await Doctor.findOne({ docId });
    if (!doctor) return res.status(401).json({ msg: "invalid Id or password",success:false  });
    const ismatch = await bcrypt.compare(password, doctor.password);
    if (!ismatch)
      return res.status(401).json({ msg: "invalid Id or password",success:false });
    const token = jwt.sign({ userId: doctor._id }, "xxxyyy", {
      expiresIn: "1h",
    });
    res.status(200).json({msg:"Login Successfull",success:true,user:doctor.name,token:token})
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});
module.exports=router
