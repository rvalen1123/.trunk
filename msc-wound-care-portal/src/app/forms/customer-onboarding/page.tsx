'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/react';
import { Input, Select, SelectItem, Textarea, Button, Checkbox } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
  // Distributor Information
  distributor_name: z.string().optional(),
  sales_rep_name: z.string().min(1, 'Sales Rep Name is required'),
  sales_rep_email: z.string().email('Must be a valid email').optional(),
  sales_rep_phone: z.string().optional(),
  iso_name: z.string().optional(),
  gpo_name: z.string().optional(),
  idn_name: z.string().optional(),
  
  // Provider Information
  provider_name: z.string().min(1, 'Provider Name is required'),
  provider_credentials: z.string().optional(),
  tax_id: z.string().min(1, 'Tax ID is required'),
  individual_npi: z.string().min(1, 'Individual NPI is required'),
  group_npi: z.string().optional(),
  ptan: z.string().optional(),
  provider_email: z.string().email('Must be a valid email').optional(),
  
  // Practice/Facility Information
  practice_name: z.string().min(1, 'Practice/Facility Name is required'),
  practice_phone: z.string().min(1, 'Practice Phone is required'),
  practice_fax: z.string().optional(),
  practice_email: z.string().email('Must be a valid email').optional(),
  facility_type: z.string().min(1, 'Facility Type is required'),
  specialty: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomerOnboardingForm() {
  const [activeTab, setActiveTab] = React.useState('distributor');
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: [],
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form data submitted:', data);
      toast.success('Customer onboarded successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to onboard customer');
    }
  };
  
  const facilityTypes = [
    { label: 'Physician Office', value: 'Physician Office' },
    { label: 'Hospital Outpatient', value: 'Hospital Outpatient' },
    { label: 'Hospital Inpatient', value: 'Hospital Inpatient' },
    { label: 'Ambulatory Surgery Center', value: 'Ambulatory Surgery Center' },
    { label: 'Skilled Nursing Facility', value: 'Skilled Nursing Facility' },
    { label: 'Wound Care Center', value: 'Wound Care Center' },
    { label: 'Critical Access Hospital', value: 'Critical Access Hospital' },
    { label: 'Government - VA', value: 'Government - VA' },
    { label: 'Government - DOD', value: 'Government - DOD' },
    { label: 'Government - IHS', value: 'Government - IHS' },
    { label: 'Long Term Care', value: 'Long Term Care' },
    { label: 'Other', value: 'Other' },
  ];
  
  const specialties = [
    { label: 'Podiatry', value: 'Podiatry' },
    { label: 'General Surgery', value: 'General Surgery' },
    { label: 'Vascular Surgery', value: 'Vascular Surgery' },
    { label: 'Orthopedic Surgery', value: 'Orthopedic Surgery' },
    { label: 'Plastic Surgery', value: 'Plastic Surgery' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'Infectious Disease', value: 'Infectious Disease' },
    { label: 'Wound Care', value: 'Wound Care' },
    { label: 'OB/GYN', value: 'OB/GYN' },
    { label: 'ENT', value: 'ENT' },
    { label: 'Other', value: 'Other' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <h1 className="text-2xl font-bold">Universal Customer Onboarding</h1>
          <p className="text-default-500">Complete the form to onboard a new customer</p>
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
              <Tab key="distributor" title="Distributor Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="distributor_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Distributor Name"
                        placeholder="Enter distributor name"
                        isInvalid={!!errors.distributor_name}
                        errorMessage={errors.distributor_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="sales_rep_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Sales Representative Name"
                        placeholder="Enter sales rep name"
                        isRequired
                        isInvalid={!!errors.sales_rep_name}
                        errorMessage={errors.sales_rep_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="sales_rep_email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Sales Representative Email"
                        placeholder="Enter sales rep email"
                        isInvalid={!!errors.sales_rep_email}
                        errorMessage={errors.sales_rep_email?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="sales_rep_phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Sales Representative Phone"
                        placeholder="Enter sales rep phone"
                        isInvalid={!!errors.sales_rep_phone}
                        errorMessage={errors.sales_rep_phone?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="iso_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="ISO (If Applicable)"
                        placeholder="Enter ISO name"
                        isInvalid={!!errors.iso_name}
                        errorMessage={errors.iso_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="gpo_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="GPO Affiliation"
                        placeholder="Enter GPO name"
                        isInvalid={!!errors.gpo_name}
                        errorMessage={errors.gpo_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="idn_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="IDN Affiliation"
                        placeholder="Enter IDN name"
                        isInvalid={!!errors.idn_name}
                        errorMessage={errors.idn_name?.message}
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('provider')}
                  >
                    Next: Provider Information
                  </Button>
                </div>
              </Tab>
              
              <Tab key="provider" title="Provider Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="provider_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Provider Name"
                        placeholder="Enter provider name"
                        isRequired
                        isInvalid={!!errors.provider_name}
                        errorMessage={errors.provider_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="provider_credentials"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Provider Credentials (MD, DO, DPM, etc.)"
                        placeholder="Enter credentials"
                        isInvalid={!!errors.provider_credentials}
                        errorMessage={errors.provider_credentials?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="tax_id"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Tax ID Number"
                        placeholder="Enter tax ID"
                        isRequired
                        isInvalid={!!errors.tax_id}
                        errorMessage={errors.tax_id?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="individual_npi"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Individual NPI"
                        placeholder="Enter individual NPI"
                        isRequired
                        isInvalid={!!errors.individual_npi}
                        errorMessage={errors.individual_npi?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="group_npi"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Group NPI"
                        placeholder="Enter group NPI"
                        isInvalid={!!errors.group_npi}
                        errorMessage={errors.group_npi?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="ptan"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="PTAN (if applicable)"
                        placeholder="Enter PTAN"
                        isInvalid={!!errors.ptan}
                        errorMessage={errors.ptan?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="provider_email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Provider Email"
                        placeholder="Enter provider email"
                        isInvalid={!!errors.provider_email}
                        errorMessage={errors.provider_email?.message}
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('distributor')}
                  >
                    Back
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('facility')}
                  >
                    Next: Facility Information
                  </Button>
                </div>
              </Tab>
              
              <Tab key="facility" title="Facility Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="practice_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Practice/Facility Name"
                        placeholder="Enter practice name"
                        isRequired
                        isInvalid={!!errors.practice_name}
                        errorMessage={errors.practice_name?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="practice_phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Practice Phone"
                        placeholder="Enter practice phone"
                        isRequired
                        isInvalid={!!errors.practice_phone}
                        errorMessage={errors.practice_phone?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="practice_fax"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Practice Fax"
                        placeholder="Enter practice fax"
                        isInvalid={!!errors.practice_fax}
                        errorMessage={errors.practice_fax?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="practice_email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Practice Email"
                        placeholder="Enter practice email"
                        isInvalid={!!errors.practice_email}
                        errorMessage={errors.practice_email?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="facility_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Facility Type"
                        placeholder="Select facility type"
                        isRequired
                        isInvalid={!!errors.facility_type}
                        errorMessage={errors.facility_type?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                        className="col-span-1 md:col-span-2"
                      >
                        {facilityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  
                  <Controller
                    name="specialty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Specialty"
                        placeholder="Select specialties"
                        selectionMode="multiple"
                        isInvalid={!!errors.specialty}
                        errorMessage={errors.specialty?.message}
                        selectedKeys={new Set(field.value)}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys));
                        }}
                        className="col-span-1 md:col-span-2"
                      >
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.value}>
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('provider')}
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