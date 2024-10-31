import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import sendSound from "../assets/images/send.mp3";
import messsageSound from "../assets/images/message.mp3";
import docImg from "../assets/images/doc.png";
import userImg from "../assets/images/user.png";
import { FaArrowLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { docName, docRole, senderId } from "../contexts/Socket";

const HealthBot = () => {
  const send = new Audio(sendSound);
  const messagesound = new Audio(messsageSound);
  const { specialist, socket, user, doctor } = useAuth();
  const [doctorSenderId, setDoctorSenderId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const isSendingRef = useRef(false);
  const [clientName, setClientName] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const clientIdRef = useRef(null);
  const doctorSenderIdRef = useRef(null);
  let sender, reciever;

  useEffect(() => {
    if (doctor) {
      localStorage.setItem("docSend", senderId);
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.on("user-connected", ({ id }) => {
        console.log(id);
        setSenderId(id);
      });
      socket.emit("specializiation", { specializiation: specialist });
    }
  }, [user, socket, specialist]);

  useEffect(() => {
    sender = localStorage.getItem("sender");
    reciever = localStorage.getItem("reciever");
    console.log(sender, reciever);
  }, [sender, reciever]);

  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Personal doctor. How can I help you today?",
      isBot: true,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      const handleReceive = ({ message, sendId, reciever }) => {
        messagesound.currentTime = 0;
        messagesound.play();
        if (user) {
          setDoctorSenderId(sendId);
          doctorSenderIdRef.current = sendId;
        } else {
          if (!clientName) {
            setClientName(reciever);
          }
          setClientId(sendId);
          clientIdRef.current = sendId;
        }
        const userMessage = { text: message, isBot: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
      };

      socket.on("receive", handleReceive);

      // Clean up listener on component unmount
      return () => {
        socket.off("receive", handleReceive);
      };
    }
  }, [socket, user]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (socket) {
      reciever = localStorage.getItem("reciever");
      sender = doctor
        ? localStorage.getItem("docSend")
        : localStorage.getItem("sender");

      const messageData = {
        reciever: user ? reciever : clientIdRef.current,
        message: input,
        sender: sender,
        recieverName: user ? user : doctor,
      };

      socket.emit("sent", messageData);
      setInput("");
      messagesound.currentTime = 0;
      send.currentTime = 0;
      send.play();
    }
  };
  const doctorChats = [
    { clientName: "Alice", lastMessage: "Can I book an appointment?" },
    { clientName: "Bob", lastMessage: "Thank you for the advice!" },
    { clientName: "Clara", lastMessage: "Should I take the meds daily?" },
    { clientName: "David", lastMessage: "Is this prescription correct?" },
    { clientName: "Eve", lastMessage: "Can we schedule a follow-up?" },
    { clientName: "steve", lastMessage: "How Can i Help you?" },
    // { clientName: "Bvc", lastMessage: "i was a mistake actually" },
  ];
  return (
    <div className="flex flex-col lg:flex-row w-screen">
      {/* Profile Box */}
      <div className="w-4/5 lg:w-1/5 h-[500px] border-2 border-black border-solid mt-10 mx-auto lg:ml-20 rounded-[30px] bg-[#64F9FA]">
        <div className="mt-12 w-full flex items-center justify-center">
          <div>
            <img
              src="src/assets/images/profile.png"
              alt="profile"
              className="w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
          </div>
        </div>
        <div className="font-bold flex justify-center w-full mt-4">
          {user ? user : doctor}
        </div>
        <div className="w-full flex justify-center mt-4">
          <button className="font-bold px-4 py-1 bg-green-500 border-none text-white rounded-xl">
            Log Out
          </button>
        </div>
        <div className="bg-gray-100 w-52 p-2 rounded-2xl mx-auto lg:ml-12 mt-6 lg:mr-10">
          Hii Glen!, Welcome back
        </div>
        <div className="w-full flex flex-col items-center mt-10">
          <p className="text-gray-400">Yesterday</p>
          <div>Greeting Exchange...</div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className={`container mx-auto px-4 py-8 ${doctor ? "lg:w-[1000px]":"lg:w-[700px]"}`}>
        <div className="flex  mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Sidebar for Doctor Chats */}
          {doctor ? (
            <div className="w-2/4 border-r border-gray-200 p-4 ">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-left mb-4 text-gray-600">
                  Chats
                </h3>
                <IoSearch size={20} className="mb-2 hover:cursor-pointer" />
              </div>
              {doctorChats.map((chat, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg mb-2 shadow-md border border-gray-200 cursor-pointer
                  transition duration-300 ease-in-out hover:bg-[#64F9FA]"
                >
                  <p className="font-semibold">{chat.clientName}</p>
                  <p className="text-gray-500 text-sm truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}

          {/* Chat Area */}
          <div className="w-2/3 lg:w-[700px] rounded-xl">
            <div className="bg-[#64f9fa] text-black px-3 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button className="text-xl font-bold text-gray-700">
                  <FaArrowLeft size={30} />
                </button>

                <div className="flex items-center">
                  <div className="h-12 w-12 bg-slate-50 rounded-full">
                    <img
                      src={`${doctor ? userImg : docImg}`}
                      alt="doctor"
                      className="rounded-full"
                    />
                  </div>
                  <div className="pl-2">
                    <h2 className="text-xl font-semibold">
                      {doctor ? clientName || "" : docName || ""}
                    </h2>
                    {user && <p className="text-sm text-gray-600">{docRole}</p>}
                  </div>
                </div>
              </div>

              <button className="text-xl font-bold text-gray-700">
                <HiDotsVertical size={25} className="text-black" />
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.isBot ? "text-left" : "text-right"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.isBot ? "bg-gray-100" : "bg-blue-500 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-grow mr-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-400"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                  onClick={handleSendMessage}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthBot;
