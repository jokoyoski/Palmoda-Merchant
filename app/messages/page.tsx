"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { MessageType } from "../_lib/type";
import { getMessages } from "../_lib/messages";
// import { format } from "date-fns";

function Page() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await getMessages();
      if (res.success) {
        setMessages(res.data);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-black font-semibold text-lg">Messages</h1>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-sm">Loading messages...</p>
        )}

        {/* Empty */}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No messages found.
          </p>
        )}

        {/* Message List */}
        <div className="space-y-4">
  {messages.map((msg) => (
    <div
      key={msg._id}
      className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-[2px] overflow-hidden"
    >
      {/* Accent left border */}
      <span className="absolute left-0 top-0 h-full w-1 bg-gray-500 rounded-l-xl"></span>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-1">
            {msg.title}
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            {msg.content}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-red-400 rounded-full"></span>
          <span className="font-medium">{msg.created_at}</span>
        </span>
      </div>
    </div>
  ))}
</div>

      </section>
    </ProtectedRoute>
  );
}

export default Page;
