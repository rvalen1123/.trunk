'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/react';
import { Input, Select, SelectItem, Textarea, Button, Checkbox } from '@nextui-org/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// Form validation schema
const formSchema = z.object({
  // Order Information
  orderNumber: z.string().min(1, 'Order Number is required'),
  orderDate: z.string().min(1, 'Order Date is required'),
  poNumber: z.string().optional(),
  requestedDeliveryDate: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  
  // Facility Information
  facilityId: z.string().min(1, 'Facility is required'),
  contactName: z.string().min(1, 'Contact Name is required'),
  contactPhone: z.string().min(1, 'Contact Phone is required'),
  contactEmail: z.string().email('Must be a valid email').optional(),
  
  // Products
  products: z.array(
    z.object({
      productId: z.string().min(1, 'Product is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one product is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrderForm() {
  const [activeTab, setActiveTab] = React.useState('order');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [facilities, setFacilities] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Mock data for facilities and products
  useEffect(() => {
    // In a real app, this would be an API call
    setFacilities([
      { label: 'Memorial Hospital', value: 'facility-1' },
      { label: 'City Medical Center', value: 'facility-2' },
      { label: 'Riverside Clinic', value: 'facility-3' },
      { label: 'Valley Health Partners', value: 'facility-4' },
    ]);
    
    setProducts([
      { 
        label: 'Advanced Wound Dressing (4x4)', 
        value: 'product-1',
        data: { unitPrice: 45.99 }
      },
      { 
        label: 'Hydrocolloid Dressing (6x6)', 
        value: 'product-2',
        data: { unitPrice: 65.50 }
      },
      { 
        label: 'Antimicrobial Foam (8x8)', 
        value: 'product-3',
        data: { unitPrice: 89.99 }
      },
      { 
        label: 'Collagen Matrix (2x2)', 
        value: 'product-4',
        data: { unitPrice: 125.00 }
      },
    ]);
  }, []);
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      products: [{ productId: '', quantity: 1 }],
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Calculate total amount
      let totalAmount = 0;
      const orderItems = data.products.map(item => {
        const product = products.find(p => p.value === item.productId)?.data;
        const itemTotal = item.quantity * (product?.unitPrice || 0);
        totalAmount += itemTotal;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product?.unitPrice || 0,
          totalPrice: itemTotal
        };
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form data submitted:', {
        ...data,
        totalAmount,
        items: orderItems
      });
      
      // Generate a mock order number
      const mockOrderNumber = `WC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderNumber(mockOrderNumber);
      setOrderSubmitted(true);
      toast.success('Order submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit order');
    }
  };
  
  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];
  
  if (orderSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-col items-start px-6 py-5">
            <h1 className="text-2xl font-bold">Order Successfully Submitted</h1>
            <p className="text-default-500">Your order has been processed</p>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-5">
            <div className="bg-success-50 text-success-700 p-4 rounded-lg mb-6">
              Your order ({orderNumber}) has been submitted successfully and is being processed.
            </div>
            
            <div className="mt-6 flex gap-2">
              <Button 
                color="primary" 
                as="a" 
                href="/dashboard"
              >
                View All Orders
              </Button>
              <Button 
                variant="bordered" 
                onPress={() => {
                  setOrderSubmitted(false);
                  setOrderNumber('');
                }}
              >
                Create Another Order
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
          <h1 className="text-2xl font-bold">MSC Wound Care Universal Order Form</h1>
          <p className="text-default-500">Complete the form to place an order</p>
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
              <Tab key="order" title="Order Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Controller
                    name="orderNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Order Number"
                        placeholder="WC-YYYY-NNNN"
                        description="Unique identifier for this order"
                        isRequired
                        isInvalid={!!errors.orderNumber}
                        errorMessage={errors.orderNumber?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="orderDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Order Date"
                        isRequired
                        isInvalid={!!errors.orderDate}
                        errorMessage={errors.orderDate?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="poNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="PO Number"
                        placeholder="Enter PO number if applicable"
                        isInvalid={!!errors.poNumber}
                        errorMessage={errors.poNumber?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="requestedDeliveryDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Requested Delivery Date"
                        isInvalid={!!errors.requestedDeliveryDate}
                        errorMessage={errors.requestedDeliveryDate?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Status"
                        placeholder="Select status"
                        isRequired
                        isInvalid={!!errors.status}
                        errorMessage={errors.status?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                      >
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
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
                    name="facilityId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Facility Name"
                        placeholder="Select facility"
                        isRequired
                        isInvalid={!!errors.facilityId}
                        errorMessage={errors.facilityId?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                        className="col-span-1 md:col-span-2"
                      >
                        {facilities.map((facility) => (
                          <SelectItem key={facility.value} value={facility.value}>
                            {facility.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  
                  <Controller
                    name="contactName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Contact Name"
                        placeholder="Enter contact name"
                        isRequired
                        isInvalid={!!errors.contactName}
                        errorMessage={errors.contactName?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="contactPhone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Contact Phone"
                        placeholder="Enter contact phone"
                        isRequired
                        isInvalid={!!errors.contactPhone}
                        errorMessage={errors.contactPhone?.message}
                      />
                    )}
                  />
                  
                  <Controller
                    name="contactEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Contact Email"
                        placeholder="Enter contact email"
                        isInvalid={!!errors.contactEmail}
                        errorMessage={errors.contactEmail?.message}
                      />
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('order')}
                  >
                    Back
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={() => setActiveTab('products')}
                  >
                    Next: Product Selection
                  </Button>
                </div>
              </Tab>
              
              <Tab key="products" title="Product Selection">
                <div className="mt-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <p className="text-default-500 text-sm">Add products to your order</p>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div 
                      key={field.id}
                      className="p-4 mb-4 border border-default-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Product {index + 1}</h4>
                        {index > 0 && (
                          <Button 
                            isIconOnly 
                            color="danger" 
                            variant="light" 
                            size="sm"
                            onPress={() => remove(index)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name={`products.${index}.productId`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              label="Product"
                              placeholder="Select product"
                              isRequired
                              isInvalid={!!errors.products?.[index]?.productId}
                              errorMessage={errors.products?.[index]?.productId?.message}
                              selectedKeys={field.value ? [field.value] : []}
                              onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                field.onChange(selected);
                              }}
                            >
                              {products.map((product) => (
                                <SelectItem key={product.value} value={product.value}>
                                  {product.label}
                                </SelectItem>
                              ))}
                            </Select>
                          )}
                        />
                        
                        <Controller
                          name={`products.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              label="Quantity"
                              placeholder="Enter quantity"
                              min={1}
                              isRequired
                              isInvalid={!!errors.products?.[index]?.quantity}
                              errorMessage={errors.products?.[index]?.quantity?.message}
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="flat" 
                    startContent={<PlusIcon className="h-4 w-4" />}
                    onPress={() => append({ productId: '', quantity: 1 })}
                    className="mb-4"
                  >
                    Add Another Product
                  </Button>
                  
                  {errors.products?.root && (
                    <div className="text-danger text-sm mb-4">
                      {errors.products.root.message}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="flat" 
                    onPress={() => setActiveTab('facility')}
                  >
                    Back
                  </Button>
                  <Button 
                    color="primary" 
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Submit Order
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