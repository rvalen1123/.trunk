import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed database with initial data for development
 */
async function main() {
  console.log('Starting database seed...');
  
  // Clear existing data
  await clearDatabase();
  
  // Create users
  const adminUser = await createUser({
    email: 'admin@mscwoundcare.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  });
  
  const staffUser = await createUser({
    email: 'staff@mscwoundcare.com',
    password: 'Staff123!',
    firstName: 'Staff',
    lastName: 'User',
    role: 'STAFF',
  });
  
  const repUser = await createUser({
    email: 'rep@mscwoundcare.com',
    password: 'Rep123!',
    firstName: 'Sales',
    lastName: 'Representative',
    role: 'REP',
  });
  
  const subRepUser = await createUser({
    email: 'subrep@mscwoundcare.com',
    password: 'SubRep123!',
    firstName: 'Sub',
    lastName: 'Representative',
    role: 'SUB_REP',
    parentId: repUser.id,
  });
  
  // Create facilities
  const facility1 = await createFacility({
    name: 'Memorial Hospital',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '555-123-4567',
    email: 'info@memorialhospital.com',
  });
  
  const facility2 = await createFacility({
    name: 'Mercy Medical Center',
    address: '456 Oak Ave',
    city: 'Riverside',
    state: 'CA',
    zip: '92501',
    phone: '555-987-6543',
    email: 'contact@mercymedical.org',
  });
  
  // Associate users with facilities
  await prisma.facilityUser.createMany({
    data: [
      { userId: adminUser.id, facilityId: facility1.id },
      { userId: adminUser.id, facilityId: facility2.id },
      { userId: staffUser.id, facilityId: facility1.id },
      { userId: repUser.id, facilityId: facility1.id },
      { userId: repUser.id, facilityId: facility2.id },
      { userId: subRepUser.id, facilityId: facility2.id },
    ],
  });
  
  // Create products
  const products = await createProducts();
  
  // Create commission rules
  await createCommissionRules(adminUser.id);
  
  // Create orders
  await createOrders(staffUser.id, [facility1.id, facility2.id], products);
  
  // Create documents
  await createDocuments(adminUser.id, staffUser.id, facility1.id);
  
  // Create dashboard preferences
  await createDashboardPreferences(adminUser.id);
  await createDashboardPreferences(staffUser.id);
  await createDashboardPreferences(repUser.id);
  await createDashboardPreferences(subRepUser.id);
  
  console.log('Database seeding completed successfully');
}

/**
 * Clear all existing data from the database
 */
async function clearDatabase() {
  // Delete in order to respect foreign key constraints
  await prisma.dashboardPreference.deleteMany({});
  await prisma.commissionPayout.deleteMany({});
  await prisma.commissionRule.deleteMany({});
  await prisma.aiInteraction.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.facilityUser.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
}

/**
 * Create a user with the given details
 * 
 * @param data - User data
 * @returns Created user
 */
async function createUser({ email, password, firstName, lastName, role, parentId = null }: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  parentId?: string | null;
}) {
  const hashedPassword = await hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role as UserRole,
      parentId,
    },
  });
}

/**
 * Create a facility with the given details
 * 
 * @param data - Facility data
 * @returns Created facility
 */
async function createFacility(data: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}) {
  return prisma.facility.create({
    data,
  });
}

/**
 * Create sample products
 * 
 * @returns Array of created products
 */
async function createProducts() {
  const products = [
    {
      name: 'Advanced Wound Dressing',
      description: 'Silicone foam dressing for moderate to heavily exuding wounds',
      sku: 'WD-1001',
      price: 24.99,
      category: 'Dressings',
    },
    {
      name: 'Antimicrobial Gel',
      description: 'Broad-spectrum antimicrobial gel for infected wounds',
      sku: 'AG-2002',
      price: 32.50,
      category: 'Antimicrobials',
    },
    {
      name: 'Compression Bandage',
      description: 'Multi-layer compression system for venous leg ulcers',
      sku: 'CB-3003',
      price: 45.75,
      category: 'Compression',
    },
    {
      name: 'Negative Pressure Wound Therapy Kit',
      description: 'Portable NPWT system for chronic wounds',
      sku: 'NP-4004',
      price: 199.99,
      category: 'Devices',
    },
    {
      name: 'Collagen Matrix',
      description: 'Advanced collagen wound matrix for tissue regeneration',
      sku: 'CM-5005',
      price: 149.95,
      category: 'Biologics',
    },
  ];
  
  await prisma.product.createMany({
    data: products,
  });
  
  return prisma.product.findMany();
}

/**
 * Create commission rules
 * 
 * @param adminId - Admin user ID
 */
async function createCommissionRules(adminId: string) {
  await prisma.commissionRule.createMany({
    data: [
      {
        name: 'Standard Rep Commission',
        rule: {
          role: 'REP',
          percentage: 10,
          minOrderValue: 100,
          categories: ['*'],
        },
        createdBy: adminId,
      },
      {
        name: 'Sub-Rep Commission',
        rule: {
          role: 'SUB_REP',
          percentage: 5,
          minOrderValue: 50,
          categories: ['*'],
        },
        createdBy: adminId,
      },
      {
        name: 'Premium Products Bonus',
        rule: {
          role: 'REP',
          percentage: 15,
          minOrderValue: 500,
          categories: ['Devices', 'Biologics'],
        },
        createdBy: adminId,
      },
    ],
  });
}

/**
 * Create sample orders
 * 
 * @param userId - User ID to associate with orders
 * @param facilityIds - Facility IDs to use for orders
 * @param products - Products to include in orders
 */
async function createOrders(userId: string, facilityIds: string[], products: any[]) {
  // Create a few orders
  for (let i = 0; i < 5; i++) {
    const facilityId = facilityIds[i % facilityIds.length];
    
    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        facilityId,
        status: i % 4 === 0 ? 'PENDING' : i % 4 === 1 ? 'APPROVED' : i % 4 === 2 ? 'SHIPPED' : 'DELIVERED',
        total: 0, // Will update after adding items
      },
    });
    
    // Add 1-3 random products to the order
    const numProducts = Math.floor(Math.random() * 3) + 1;
    let orderTotal = 0;
    
    for (let j = 0; j < numProducts; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = parseFloat(product.price);
      const itemTotal = price * quantity;
      orderTotal += itemTotal;
      
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price,
        },
      });
    }
    
    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { total: orderTotal },
    });
  }
}

/**
 * Create sample documents
 * 
 * @param createdById - User ID who created the documents
 * @param updatedById - User ID who last updated the documents
 * @param facilityId - Facility ID to associate with documents
 */
async function createDocuments(createdById: string, updatedById: string, facilityId: string) {
  const documentTypes = ['BAA', 'PRIOR_AUTH', 'WOUND_ASSESSMENT', 'ORDER_FORM', 'TRAINING'];
  
  for (const type of documentTypes) {
    await prisma.document.create({
      data: {
        title: `Sample ${type.replace('_', ' ')} Document`,
        type: type as any,
        content: {
          sections: [
            {
              title: 'Basic Information',
              fields: [
                { name: 'patient_name', label: 'Patient Name', value: 'John Smith' },
                { name: 'date', label: 'Date', value: new Date().toISOString() },
              ],
            },
            {
              title: 'Additional Details',
              fields: [
                { name: 'notes', label: 'Notes', value: 'Sample document for testing' },
              ],
            },
          ],
        },
        facilityId,
        createdById,
        updatedById,
      },
    });
  }
}

/**
 * Create dashboard preferences for a user
 * 
 * @param userId - User ID to create preferences for
 */
async function createDashboardPreferences(userId: string) {
  // Sample widget IDs - these should match the IDs defined in widget-registry.ts
  const widgets = [
    { id: 'recentOrders', position: 0, size: 'large' },
    { id: 'salesOverview', position: 1, size: 'medium' },
    { id: 'upcomingTraining', position: 2, size: 'medium' },
    { id: 'pendingDocuments', position: 3, size: 'medium' },
    { id: 'commissionSummary', position: 4, size: 'medium' },
  ];
  
  for (const widget of widgets) {
    await prisma.dashboardPreference.create({
      data: {
        userId,
        widgetId: widget.id,
        enabled: true,
        position: widget.position,
        size: widget.size,
      },
    });
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma connection
    await prisma.$disconnect();
  }); 