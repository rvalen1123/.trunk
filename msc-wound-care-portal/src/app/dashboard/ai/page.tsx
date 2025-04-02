"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Input,
  Button,
  Select,
  SelectItem,
  Spacer,
} from "@heroui/react";
import ChatInterface from "@/components/ai/chat-interface";
import DocumentList from "@/components/documents/document-list";

export default function AIAssistantsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Assistants</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">MSC Wound Care AI Assistant</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="mb-4 text-default-500">
            Our AI assistant is powered by Azure OpenAI and can help with product recommendations, 
            training, and form completion. Select a mode in the tabs below to get started.
          </p>
          
          <ChatInterface 
            assistantName="MSC AI"
            assistantDescription="I can help with wound care product recommendations, training, and form completion."
            assistantAvatar="/ai-assistant.png"
          />
        </CardBody>
      </Card>
    </div>
  );
}
