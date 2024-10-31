// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Variables to hold user and sender IDs
let userId = null;
let senderId = null;
let docRole=null
let docName=null;
// Event listeners
socket.on("user-connected", ({ id }) => {
  console.log("User connected with ID:", id);
  senderId = id;
  localStorage.setItem("sender", id);

  // Uncomment if you want to conditionally set sender ID based on "user" existence in localStorage
  // if (localStorage.getItem("user")) {
  //   localStorage.setItem("sender", id);
  // }
});

socket.on("doctor-login", (data) => {
  console.log("Doctor logged in:", data);
  // Additional logic for when a doctor logs in
});

socket.on("specialization", (data) => {
  console.log("Specialization data received:", data);
  // Handle specialization-related data
});

socket.on("doctor-id", ({ docId,role,name }) => {
  if (localStorage.getItem("user")) {
    localStorage.setItem("reciever", docId);
    console.log(role)
    docRole=role
    docName=name
    console.log(docName);
    userId = docId; // Update userId with doctor ID when received
  }
});

// Export socket instance and IDs for use in other components
export { socket,senderId,docRole,docName };
