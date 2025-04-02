'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/react';
import { Input, Select, SelectItem, Textarea, Button, Checkbox, RadioGroup, Radio } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
  // Form Setup
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  requestInfo: z.object({
    requestType: z.string().min(1, 'Request Type is required'),
    requestDate: z.string().min(1, 'Request Date is required'),
    salesRepName: z.string().min(1, 'Sales Representative is required'),
    salesRepEmail: z.string().email('Must be a valid email').optional(),
    additionalNotificationEmails: z.string().optional(),
  }),
  
  // Patient & Insurance
  patientInfo: z.object({
    patientName: z.string().min(1, 'Patient Name is required'),
    patientDOB: z.string().min(1, 'Date of Birth is required'),
    patientGender: z.string().optional(),
  }),
  
  insuranceInfo: z.object({
    primaryInsurance: z.object({
      primaryInsuranceName: z.string().min(1, 'Insurance Name is required'),
      primaryPolicyNumber: z.string().min(1, 'Policy Number is required'),
    }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function InsuranceVerificationForm() {
  const [activeTab, setActiveTab] = React.useState('setup');
  const [generatedDocs, setGeneratedDocs] = useState<any[]>([]);
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestInfo: {
        requestDate: new Date().toISOString().split('T')[0],
      },
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form data submitted:', data);
      
      // Simulate generated documents
      setGeneratedDocs([
        {
          name: 'Insurance Verification Form',
          status: 'completed',
          downloadUrl: '#',
          signingUrl: '#',
        },
        {
          name: 'Prior Authorization Request',
          status: 'pending',
          downloadUrl: '#',
          signingUrl: '#',
        }
      ]);
      
      toast.success('Insurance verification request submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit verification request');
    }
  };
  
  const manufacturers = [
    { label: 'ACZ Distribution', value: 'ACZ_Distribution' },
    { label: 'Advanced Solution', value: 'Advanced_Solution' },
    { label: 'MedLife Solutions', value: 'MedLife_Solutions' },
    { label: 'BioWound Solutions', value: 'BioWound_Solutions' },
    { label: 'Imbed Biosciences (Microlyte)', value: 'Imbed_Biosciences' },
    { label: 'Extremity Care', value: 'Extremity_Care' },
    { label: 'StimLabs', value: 'StimLabs' },
    { label: 'Centurion Therapeutics', value: 'Centurion_Therapeutics' },
  ];
  
  const requestTypes = [
    { label: 'New Request', value: 'new_request' },
    { label: 'Re-verification', value: 'reverification' },
    { label: 'Additional Applications', value: 'additional_applications' },
    { label: 'New Insurance', value: 'new_insurance' },
  ];
  
  if (generatedDocs.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-col items-start px-6 py-5">
            <h1 className="text-2xl font-bold">Documents Generated Successfully</h1>
            <p className="text-default-500">Your insurance verification request has been submitted</p>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-5">
            <div className="bg-success-50 text-success-700 p-4 rounded-lg mb-6">
              Your insurance verification request has been submitted. The following documents were generated:
            </div>
            
            <div className="space-y-4">
              {generatedDocs.map((doc, index) => (
                <Card key={`doc-${index}`} className="border border-default-200">
                  <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{doc.name}</h3>
                        <p className="text-default-500">Status: {doc.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          as="a" 
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download PDF
                        </Button>
                        {doc.signingUrl && (
                          <Button 
                            variant="bordered" 
                            as="a" 
                            href={doc.signingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            E-Sign Document
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                color="primary" 
                onPress={() => setGeneratedDocs([])}
              >
                Submit Another Request
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <h1 className="text-2xl font-bold">MSC Wound Care IVR Form</h1>
          <p className="text-default-500">Complete the form to submit an insurance verification request</p>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs 
              aria-label="Form Sections" 
              selectedKey={activeTab} 
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="mb-6"
            >
              <Tab key="setup" title="Form Setup">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="manufacturer"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Manufacturer"
                        placeholder="Select manufacturer"
                        isRequired
                        isInvalid={!!errors.manufacturer}
                        errorMessage={errors.manufacturer?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                        className="col-span-1 md:col-span-2"
                      >
                        {manufacturers.map((manufacturer) => (
                          <SelectItem key={manufacturer.value} value={manufacturer.value}>
                            {manufacturer.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  
                  <Controller
                    name="requestInfo.requestType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Request Type"
                        placeholder="Select request type"
                        isRequired
                        isInvalid={!!errors.requestInfo?.requestType}
                        errorMessage={errors.requestInfo?.requestType?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                      >
                        {requestTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  
                  <Controller
                    name="requestInfo.requestDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Request Date"
                        isRequired
                        isInvalid={!!errors.requestInfo?.requestDate}
                        errorMessage={errors.requestInfo?.requestDate?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="requestInfo.salesRepName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Sales Representative"
                        placeholder="Enter sales rep name"
                        isRequired
                        isInvalid={!!errors.requestInfo?.salesRepName}
                        errorMessage={errors.requestInfo?.salesRepName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="requestInfo.salesRepEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Sales Rep Email"
                        placeholder="Enter sales rep email"
                        isInvalid={!!errors.requestInfo?.salesRepEmail}
                        errorMessage={errors.requestInfo?.salesRepEmail?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="requestInfo.additionalNotificationEmails"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Additional Notification Emails"
                        placeholder="Enter additional emails (comma separated)"
                        helperText="BAA required for additional recipients"
                        isInvalid={!!errors.requestInfo?.additionalNotificationEmails}
                        errorMessage={errors.requestInfo?.additionalNotificationEmails?.message}
                        className="col-span-1 md:col-span-2"
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('patient')}
                  >
                    Next: Patient & Insurance
                  </Button>
                </div>
              </Tab>
              
              <Tab key="patient" title="Patient & Insurance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="patientInfo.patientName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Patient Name"
                        placeholder="Enter patient name"
                        isRequired
                        isInvalid={!!errors.patientInfo?.patientName}
                        errorMessage={errors.patientInfo?.patientName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="patientInfo.patientDOB"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Date of Birth"
                        isRequired
                        isInvalid={!!errors.patientInfo?.patientDOB}
                        errorMessage={errors.patientInfo?.patientDOB?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="patientInfo.patientGender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        label="Gender"
                        orientation="horizontal"
                        value={field.value}
                        onValueChange={field.onChange}
                        isInvalid={!!errors.patientInfo?.patientGender}
                        errorMessage={errors.patientInfo?.patientGender?.message}
                      >
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </RadioGroup>
                    )}
                  />
                  
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Primary Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="insuranceInfo.primaryInsurance.primaryInsuranceName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Insurance Name"
                            placeholder="Enter insurance name"
                            isRequired
                            isInvalid={!!errors.insuranceInfo?.primaryInsurance?.primaryInsuranceName}
                            errorMessage={errors.insuranceInfo?.primaryInsurance?.primaryInsuranceName?.message}
                          />
                        )}
                      />
                      
                      <Controller
                        name="insuranceInfo.primaryInsurance.primaryPolicyNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Policy Number"
                            placeholder="Enter policy number"
                            isRequired
                            isInvalid={!!errors.insuranceInfo?.primaryInsurance?.primaryPolicyNumber}
                            errorMessage={errors.insuranceInfo?.primaryInsurance?.primaryPolicyNumber?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('setup')}
                  >
                    Back
                  </Button>
                  <Button 
                    color="primary" 
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </Tab>
            </Tabs>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}