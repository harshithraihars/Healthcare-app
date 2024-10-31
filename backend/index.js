const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // User authentication routes
const docrouter = require("./routes/docRoute"); // Doctor-specific routes
const { log } = require("console");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://harshith:2005@nodeexpreeproject.5kniwxy.mongodb.net/healthcare?retryWrites=true&w=majority&appName=nodeExpreeproject"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/auth", authRoutes); // For user authentication
app.use("/api/doctor", docrouter); // For doctor authentication

// Error handling middleware (if using custom error handler)
// app.use(errorHandler);

// Listening for HTTP and Socket.IO connections
const PORT = 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
let currentUsers = [];

// Socket.IO functionality
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.emit("user-connected", { id: socket.id });

  socket.on("user-name", ({ user }) => {
    console.log(user);

    // Check if the user already exists in currentUsers
    const userExists = currentUsers.some(
      (existingUser) => existingUser.id === socket.id
    );

    if (!userExists) {
      const newUser = {
        id: socket.id,
        name: user,
        role: "patient",
      };
      currentUsers.push(newUser);
      console.log(currentUsers);
    } else {
      console.log("User already exists:", socket.id);
    }
  });

  socket.on("specializiation", ({ specializiation }) => {
    console.log(specializiation);

    const doc = currentUsers.find((user) => user.role === specializiation);
    if (doc) {
      console.log("required doc is ", doc.id);
      socket.emit("doctor-id", { docId: doc.id,role:specializiation,name:doc.name});
    }
  });

  socket.on("doctor-login", async ({ id }) => {
    const doc = await Doctor.findOne({ docId: id });
    if (doc) {
      const newuser = {
        id: socket.id,
        name: doc.name,
        role: doc.specialization,
      };
      currentUsers.push(newuser);
      console.log(currentUsers);
    }
  });
  socket.on("sent",({reciever,message,sender,recieverName})=>{
    console.log(reciever)
    console.log(sender);
    
    socket.to(reciever).emit("receive", {message:message,sendId:sender,reciever:recieverName});
  })
  socket.on("disconnect", () => {
    currentUsers=currentUsers.filter((user)=>user.id!==socket.id)
    console.log(`User disconnected: ${socket.id}`);
  });
});
