"use client";
import React, { useState } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useMessageCount, useMessageList, useReadMessage } from "../_lib/useMessages";
import { MessageType } from "../_lib/type";
import { Mail, MailOpen, Check } from "lucide-react";

function Page() {
  const { data, isLoading, isError, error } = useMessageList();
  const { data: countData } = useMessageCount();
  const readMessageMutation = useReadMessage();

  // ✅ Track locally marked messages
  const [locallyReadMessages, setLocallyReadMessages] = useState<Set<string>>(new Set());

  const messages = data?.data || [];
  const count = countData?.data?.unread_count || 0;

  const handleMarkAsRead = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ✅ Immediately mark as read locally for instant UI update
    setLocallyReadMessages(prev => new Set(prev).add(messageId));
    
    readMessageMutation.mutate(messageId);
  };

  return (
    <ProtectedRoute>
      <section className="bg-gray-50 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-black font-bold text-xl mb-0.5">Messages</h1>
              <p className="text-gray-500 text-sm">
                {count > 0 ? `${count} unread message${count > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-3"></div>
              <p className="text-gray-500 text-sm">Loading messages...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-red-600 text-sm font-medium">
                Error loading messages: {error?.message || "Something went wrong"}
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && messages.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MailOpen className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base font-medium">No messages found</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          )}

          {/* Message List */}
          <div className="space-y-3">
            {messages.map((msg: MessageType) => {
              // ✅ Check both server state and local state
              const isRead = msg.is_read || locallyReadMessages.has(msg._id);
              
              return (
                <div
                  key={msg._id}
                  className={`relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                    !isRead ? "border-l-4 border-black" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-semibold text-black text-base">
                            {msg.title}
                          </h2>
                          {!isRead && (
                            <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>

                        {/* Mark as read button - ✅ now uses combined isRead state */}
                        {!isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(msg._id, e)}
                            disabled={readMessageMutation.isPending}
                            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Mark as read
                          </button>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        {msg.content}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{msg.created_at}</span>
                        {msg.message_type && msg.message_type !== "text" && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{msg.message_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default Page;