"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Textarea,
  Button,
  ScrollShadow,
  Avatar,
  Tooltip,
  Spinner,
  Tabs,
  Tab,
  CardFooter,
  Input,
  Chip
} from "@nextui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import AIServiceWrapper from "./AIServiceWrapper";
import aiEcosystemService, { AssistantType } from "@/lib/services/ai-ecosystem";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  assistantName: string;
  assistantDescription: string;
  assistantAvatar?: string;
  assistantType?: AssistantType;
}

export default function ChatInterface({
  assistantName,
  assistantDescription,
  assistantAvatar,
  assistantType = AssistantType.GENERAL
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm ${assistantName}. ${assistantDescription}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for the AI service
      const formattedMessages = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      // Add the new user message
      formattedMessages.push({
        role: "user",
        content: userMessage.content
      });
      
      // Call the AI service
      const { response, sessionId: newSessionId } = await aiEcosystemService.sendMessage(
        formattedMessages,
        assistantType,
        sessionId
      );
      
      // Store the session ID for future messages
      if (newSessionId) {
        setSessionId(newSessionId);
      }
      
      // Add the assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // The error will be caught by the AIServiceWrapper
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleError = (error: Error) => {
    // Add an error message from the assistant
    const errorMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, errorMessage]);
    setIsLoading(false);
  };

  // The actual chat interface UI wrapped in the AIServiceWrapper
  return (
    <AIServiceWrapper serviceName={assistantName} onError={handleError}>
      <Card className="h-[calc(100vh-12rem)] w-full">
        <CardBody className="flex flex-col gap-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary-100 text-primary-900"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar
                    src={assistantAvatar || "https://i.pravatar.cc/150?img=7"}
                    size="sm"
                    className="mt-1"
                  />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {message.role === "user" ? "You" : assistantName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Avatar
                  src={assistantAvatar || "https://i.pravatar.cc/150?img=7"}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{assistantName}</span>
                  <Chip size="sm" variant="dot" color="primary">
                    Thinking...
                  </Chip>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardBody>
        <CardFooter className="border-t border-divider bg-background p-3">
          <div className="flex w-full items-center gap-2">
            <Input
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button
              isIconOnly
              color="primary"
              aria-label="Send"
              onClick={handleSend}
              isDisabled={!input.trim() || isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AIServiceWrapper>
  );
}
