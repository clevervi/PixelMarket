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

    // Encontrar la aplicación
    const application = getVendorApplicationById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Crear usuario store-manager a partir de la aplicación
      const existingUser = findUserByEmail(application.email);
      
      if (existingUser) {
        // Si el usuario existe, actualizar su rol a store-manager
        updateUser(application.email, {
          role: 'store-manager',
          storeName: application.business,
        });
      } else {
        // Crear nuevo usuario como store-manager (sin contraseña, requerirá reset)
        const newVendor = {
          id: `vendor_${Date.now()}`,
          email: application.email,
          firstName: application.name.split(' ')[0],
          lastName: application.name.split(' ').slice(1).join(' ') || '',
          phone: application.phone,
          role: 'store-manager',
          storeName: application.business,
          isActive: true,
          passwordHash: null, // El vendor deberá establecer una contraseña
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
