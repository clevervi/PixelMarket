import { NextResponse } from 'next/server';
import { 
  getVendorApplicationById, 
  updateVendorApplication, 
  findUserByEmail, 
  addUser, 
  updateUser 
} from '@/lib/app-state';

export async function POST(req: Request) {
  try {
    const { applicationId, action, adminId } = await req.json();

    if (!applicationId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    // Find the application
    const application = getVendorApplicationById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Create a store-manager user from the application
      const existingUser = findUserByEmail(application.email);
      
      if (existingUser) {
        // If the user exists, update their role to store-manager
        updateUser(application.email, {
          role: 'store-manager',
          storeName: application.business,
        });
      } else {
        // Create a new store-manager user (no password, will require reset)
        const newVendor = {
          id: `vendor_${Date.now()}`,
          email: application.email,
          firstName: application.name.split(' ')[0],
          lastName: application.name.split(' ').slice(1).join(' ') || '',
          phone: application.phone,
          role: 'store-manager',
          storeName: application.business,
          isActive: true,
          passwordHash: null, // The vendor must set a password
        };
        addUser(newVendor);
      }

      updateVendorApplication(applicationId, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: adminId,
      });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Vendor application approved. User can now login as store-manager.',
          application: getVendorApplicationById(applicationId)
        },
        { status: 200 }
      );
    } else if (action === 'reject') {
      updateVendorApplication(applicationId, {
        status: 'rejected',
        approvedAt: new Date(),
        approvedBy: adminId,
      });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Vendor application rejected',
          application: getVendorApplicationById(applicationId)
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to process application' },
      { status: 500 }
    );
  }
}
