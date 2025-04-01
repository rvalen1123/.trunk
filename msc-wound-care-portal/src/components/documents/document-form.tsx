"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Chip,
} from "@nextui-org/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface DocumentFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function DocumentForm({
  onSubmit,
  isLoading = false,
}: DocumentFormProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientDOB: "",
    facilityName: "",
    woundType: "",
    woundLocation: "",
    woundDescription: "",
    treatmentPlan: "",
    documentType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const documentTypes = [
    { value: "prior-auth", label: "Prior Authorization" },
    { value: "order-form", label: "Order Form" },
    { value: "baa-agreement", label: "BAA Agreement" },
    { value: "progress-note", label: "Progress Note" },
  ];

  const woundTypes = [
    { value: "pressure", label: "Pressure Ulcer" },
    { value: "venous", label: "Venous Ulcer" },
    { value: "diabetic", label: "Diabetic Ulcer" },
    { value: "surgical", label: "Surgical Wound" },
    { value: "traumatic", label: "Traumatic Wound" },
    { value: "arterial", label: "Arterial Ulcer" },
    { value: "other", label: "Other" },
  ];

  return (
    <Card className="w-full">
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-primary-500" />
            <h3 className="text-lg font-semibold">Document Information</h3>
          </div>
          <Divider className="my-2" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Document Type"
              placeholder="Select document type"
              value={formData.documentType}
              onChange={(e) =>
                handleSelectChange("documentType", e.target.value)
              }
              isRequired
            >
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Facility Name"
              placeholder="Enter facility name"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              isRequired
            />
          </div>

          <div className="flex items-center gap-2">
            <Chip color="primary" variant="flat">
              Patient Information
            </Chip>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Patient Name"
              placeholder="Enter patient name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              isRequired
            />

            <Input
              label="Date of Birth"
              placeholder="MM/DD/YYYY"
              name="patientDOB"
              value={formData.patientDOB}
              onChange={handleChange}
              isRequired
            />
          </div>

          <div className="flex items-center gap-2">
            <Chip color="primary" variant="flat">
              Wound Information
            </Chip>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Wound Type"
              placeholder="Select wound type"
              value={formData.woundType}
              onChange={(e) => handleSelectChange("woundType", e.target.value)}
              isRequired
            >
              {woundTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Wound Location"
              placeholder="Enter wound location"
              name="woundLocation"
              value={formData.woundLocation}
              onChange={handleChange}
              isRequired
            />
          </div>

          <Textarea
            label="Wound Description"
            placeholder="Describe the wound characteristics, size, drainage, etc."
            name="woundDescription"
            value={formData.woundDescription}
            onChange={handleChange}
            minRows={3}
            isRequired
          />

          <Textarea
            label="Treatment Plan"
            placeholder="Describe the current or proposed treatment plan"
            name="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={handleChange}
            minRows={3}
            isRequired
          />
        </form>
      </CardBody>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="flat" color="danger">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Generate Document
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
