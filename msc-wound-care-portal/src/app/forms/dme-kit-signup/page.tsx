'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/react';
import { Input, Select, SelectItem, Textarea, Button, Checkbox } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
  // Provider Information
  providerName: z.string().min(1, 'Provider Name is required'),
  practiceName: z.string().min(1, 'Practice Name is required'),
  npi: z.string().min(1, 'NPI Number is required'),
  email: z.string().email('Must be a valid email').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone Number is required'),
  
  // Kit Selection
  kitType: z.string().min(1, 'Kit Type is required'),
  customKitDetails: z.string().optional().refine(val => {
    // If kitType is 'custom', customKitDetails is required
    return true;
  }, {
    message: 'Custom Kit Details are required when Custom Kit is selected',
    path: ['customKitDetails'],
  }),
  quantityNeeded: z.number().min(1, 'Quantity must be at least 1'),
  
  // Shipping Information
  shippingAddress: z.object({
    addressLine1: z.string().min(1, 'Address Line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP Code is required'),
  }),
  shippingNotes: z.string().optional(),
  
  // Additional Information
  salesRepName: z.string().optional(),
  startDate: z.string().optional(),
  additionalRequirements: z.string().optional(),
  agreementAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DmeKitSignupForm() {
  const [activeTab, setActiveTab] = React.useState('provider');
  const [submitted, setSubmitted] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantityNeeded: 1,
      agreementAccepted: false,
    }
  });
  
  const kitType = watch('kitType');
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form data submitted:', data);
      setSubmitted(true);
      toast.success('DME Kit sign-up submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit DME Kit sign-up');
    }
  };
  
  const kitTypes = [
    { label: 'Basic Wound Care Kit', value: 'basic' },
    { label: 'Advanced Wound Care Kit', value: 'advanced' },
    { label: 'Diabetic Foot Ulcer Kit', value: 'dfu' },
    { label: 'Venous Leg Ulcer Kit', value: 'vlu' },
    { label: 'Pressure Ulcer Kit', value: 'pressure' },
    { label: 'Custom Kit', value: 'custom' },
  ];
  
  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-col items-start px-6 py-5">
            <h1 className="text-2xl font-bold">DME Kit Sign-up Successful</h1>
            <p className="text-default-500">Your request has been submitted</p>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-5">
            <div className="bg-success-50 text-success-700 p-4 rounded-lg mb-6">
              Your DME Kit sign-up has been submitted successfully. A representative will contact you shortly to confirm the details.
            </div>
            
            <div className="mt-6">
              <Button 
                color="primary" 
                onPress={() => setSubmitted(false)}
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
          <h1 className="text-2xl font-bold">DME Kit Sign-up</h1>
          <p className="text-default-500">Complete the form to sign up for DME kits</p>
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
              <Tab key="provider" title="Provider Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="providerName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Provider Name"
                        placeholder="Enter provider name"
                        isRequired
                        isInvalid={!!errors.providerName}
                        errorMessage={errors.providerName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="practiceName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Practice Name"
                        placeholder="Enter practice name"
                        isRequired
                        isInvalid={!!errors.practiceName}
                        errorMessage={errors.practiceName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="npi"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="NPI Number"
                        placeholder="Enter NPI number"
                        isRequired
                        isInvalid={!!errors.npi}
                        errorMessage={errors.npi?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email Address"
                        placeholder="Enter email address"
                        isRequired
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Phone Number"
                        placeholder="Enter phone number"
                        isRequired
                        isInvalid={!!errors.phone}
                        errorMessage={errors.phone?.message}
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('kit')}
                  >
                    Next: Kit Selection
                  </Button>
                </div>
              </Tab>
              
              <Tab key="kit" title="Kit Selection">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Controller
                    name="kitType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="DME Kit Type"
                        placeholder="Select kit type"
                        isRequired
                        isInvalid={!!errors.kitType}
                        errorMessage={errors.kitType?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                      >
                        {kitTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  
                  {kitType === 'custom' && (
                    <Controller
                      name="customKitDetails"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Custom Kit Details"
                          placeholder="Please describe the items you would like in your custom kit"
                          isInvalid={!!errors.customKitDetails}
                          errorMessage={errors.customKitDetails?.message}
                          minRows={3}
                        />
                      )}
                    />
                  )}
                  
                  <Controller
                    name="quantityNeeded"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Monthly Quantity Needed"
                        placeholder="Enter quantity"
                        description="Estimated number of kits needed per month"
                        isRequired
                        min={1}
                        isInvalid={!!errors.quantityNeeded}
                        errorMessage={errors.quantityNeeded?.message}
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                      />
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
                    onPress={() => setActiveTab('shipping')}
                  >
                    Next: Shipping Information
                  </Button>
                </div>
              </Tab>
              
              <Tab key="shipping" title="Shipping Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="shippingAddress.addressLine1"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Address Line 1"
                        placeholder="Enter street address"
                        isRequired
                        isInvalid={!!errors.shippingAddress?.addressLine1}
                        errorMessage={errors.shippingAddress?.addressLine1?.message}
                        className="col-span-1 md:col-span-2"
                      />
                    )}
                  />
                  
                  <Controller
                    name="shippingAddress.addressLine2"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Address Line 2"
                        placeholder="Enter apt, suite, unit, etc."
                        isInvalid={!!errors.shippingAddress?.addressLine2}
                        errorMessage={errors.shippingAddress?.addressLine2?.message}
                        className="col-span-1 md:col-span-2"
                      />
                    )}
                  />
                  
                  <Controller
                    name="shippingAddress.city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="City"
                        placeholder="Enter city"
                        isRequired
                        isInvalid={!!errors.shippingAddress?.city}
                        errorMessage={errors.shippingAddress?.city?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="shippingAddress.state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="State"
                        placeholder="Enter state"
                        isRequired
                        isInvalid={!!errors.shippingAddress?.state}
                        errorMessage={errors.shippingAddress?.state?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="shippingAddress.zipCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="ZIP Code"
                        placeholder="Enter ZIP code"
                        isRequired
                        isInvalid={!!errors.shippingAddress?.zipCode}
                        errorMessage={errors.shippingAddress?.zipCode?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="shippingNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Shipping Notes"
                        placeholder="Any special delivery instructions"
                        isInvalid={!!errors.shippingNotes}
                        errorMessage={errors.shippingNotes?.message}
                        className="col-span-1 md:col-span-2"
                        minRows={2}
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('kit')}
                  >
                    Back
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('additional')}
                  >
                    Next: Additional Information
                  </Button>
                </div>
              </Tab>
              
              <Tab key="additional" title="Additional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="salesRepName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Sales Representative Name"
                        placeholder="If you were referred by a sales rep"
                        isInvalid={!!errors.salesRepName}
                        errorMessage={errors.salesRepName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Requested Start Date"
                        isInvalid={!!errors.startDate}
                        errorMessage={errors.startDate?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="additionalRequirements"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Additional Requirements"
                        placeholder="Any other special requirements or notes"
                        isInvalid={!!errors.additionalRequirements}
                        errorMessage={errors.additionalRequirements?.message}
                        className="col-span-1 md:col-span-2"
                        minRows={3}
                      />
                    )}
                  />
                  
                  <Controller
                    name="agreementAccepted"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        isInvalid={!!errors.agreementAccepted}
                        className="col-span-1 md:col-span-2"
                      >
                        I agree to the terms and conditions for DME Kit services
                      </Checkbox>
                    )}
                  />
                  {errors.agreementAccepted && (
                    <div className="text-danger col-span-1 md:col-span-2 text-sm">
                      {errors.agreementAccepted.message}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('shipping')}
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