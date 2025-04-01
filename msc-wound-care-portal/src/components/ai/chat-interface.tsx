"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
}

export default function ChatInterface({
  assistantName,
  assistantDescription,
  assistantAvatar,
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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response from ${assistantName}. In a real implementation, this would call the Azure OpenAI API to generate a response based on your message: "${input}"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] w-full">
      <Tabs aria-label="Assistant Modes" color="primary" className="p-0">
        <Tab key="product" title="Product Recommendations">
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
        </Tab>
        <Tab key="training" title="Training Assistant">
          <CardBody className="flex flex-col gap-4 overflow-y-auto p-4">
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Avatar
                  src={assistantAvatar || "https://i.pravatar.cc/150?img=7"}
                  size="sm"
                  className="mt-1"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{assistantName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    Welcome to the Training Assistant mode! I can help you learn about wound care products, protocols, and sales techniques. What would you like to learn about today?
                  </p>
                </div>
              </div>
            </div>
            <div ref={messagesEndRef} />
          </CardBody>
        </Tab>
        <Tab key="form" title="Form Completion">
          <CardBody className="flex flex-col gap-4 overflow-y-auto p-4">
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Avatar
                  src={assistantAvatar || "https://i.pravatar.cc/150?img=7"}
                  size="sm"
                  className="mt-1"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{assistantName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    Welcome to the Form Completion mode! Describe a patient's wound and condition in natural language, and I'll help extract the relevant information to auto-fill forms. How can I assist you today?
                  </p>
                </div>
              </div>
            </div>
            <div ref={messagesEndRef} />
          </CardBody>
        </Tab>
      </Tabs>
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
  );
}
