import React from "react";
import Button2 from "./Button2";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const ChatUI = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4  border-r border-[#FFB992]">
        {/* Sidebar Header */}
        <header className="p-4 border-b border-[#FFB992] flex justify-between items-centertext-white">
          <IoArrowBackCircleOutline
            className="h-10 w-10 bg-[#E0CDB6]"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl font-semibold text-[#FFB992]">Chats</h1>
        </header>

        {/* Contact List */}
        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          {/* Contacts Go Here */}
          <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img
                src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#FFB992]">Alice</h2>
              <p className="text-slate-400">Hoorayy!!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {/* Chat Header */}
        <header className="bg-[#E0CDB6] p-4 text-gray-700">
          <h1 className="text-2xl font-semibold">Alice</h1>
        </header>

        {/* Chat Messages */}
        <div className="h-screen overflow-y-auto p-4 pb-36">
          {/* Messages Go Here */}
          {/* incoming */}
          <div className="flex mb-4 cursor-pointer">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
              <img
                src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
              <p className="text-white-700">Hey Bob, how's it going?</p>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end mb-4 cursor-pointer">
            <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
              <p>
                Hi Alice! I'm good, just finished a great book. How about you?
              </p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
              <img
                src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                alt="My Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <footer className="bg-[#E0CDB6] border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border bg-[#1E1E1E] border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-md ml-2">
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatUI;
