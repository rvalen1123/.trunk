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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import DocumentList from "@/components/documents/document-list";
import DocumentForm from "@/components/documents/document-form";

export default function DocumentsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  // Mock document data
  const documents = [
    {
      id: "1",
      name: "Prior Authorization - John Smith",
      type: "Prior Auth",
      status: "Completed",
      createdAt: "2025-03-25",
      patient: "John Smith",
    },
    {
      id: "2",
      name: "BAA Agreement - Memorial Hospital",
      type: "Agreement",
      status: "Pending",
      createdAt: "2025-03-26",
      patient: "Memorial Hospital",
    },
    {
      id: "3",
      name: "Order Form - Jane Doe",
      type: "Order",
      status: "Processing",
      createdAt: "2025-03-27",
      patient: "Jane Doe",
    },
    {
      id: "4",
      name: "Progress Note - Robert Johnson",
      type: "Report",
      status: "Draft",
      createdAt: "2025-03-28",
      patient: "Robert Johnson",
    },
    {
      id: "5",
      name: "Prior Authorization - Sarah Williams",
      type: "Prior Auth",
      status: "Rejected",
      createdAt: "2025-03-29",
      patient: "Sarah Williams",
    },
    {
      id: "6",
      name: "Order Form - Michael Brown",
      type: "Order",
      status: "Completed",
      createdAt: "2025-03-30",
      patient: "Michael Brown",
    },
    {
      id: "7",
      name: "BAA Agreement - City Hospital",
      type: "Agreement",
      status: "Pending",
      createdAt: "2025-03-31",
      patient: "City Hospital",
    },
  ];

  const handleDocumentAction = (action: string, document: any) => {
    console.log(`Action: ${action}`, document);
    // Implement actual actions here
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Add success notification here
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button color="primary" startContent={<PlusIcon className="h-5 w-5" />} onPress={onOpen}>
          New Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Document Management</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Tabs aria-label="Document categories" color="primary">
            <Tab key="all" title="All Documents">
              <div className="mt-4">
                <DocumentList documents={documents} onAction={handleDocumentAction} />
              </div>
            </Tab>
            <Tab key="prior-auth" title="Prior Authorizations">
              <div className="mt-4">
                <DocumentList 
                  documents={documents.filter(doc => doc.type === "Prior Auth")} 
                  onAction={handleDocumentAction} 
                />
              </div>
            </Tab>
            <Tab key="orders" title="Orders">
              <div className="mt-4">
                <DocumentList 
                  documents={documents.filter(doc => doc.type === "Order")} 
                  onAction={handleDocumentAction} 
                />
              </div>
            </Tab>
            <Tab key="agreements" title="Agreements">
              <div className="mt-4">
                <DocumentList 
                  documents={documents.filter(doc => doc.type === "Agreement")} 
                  onAction={handleDocumentAction} 
                />
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Document</ModalHeader>
              <ModalBody>
                <DocumentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
