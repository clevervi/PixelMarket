import jsPDF from 'jspdf';
import { Order } from '@/types';

export function generateInvoicePDF(order: Order): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(24);
  doc.text('Ancestral heartbeat', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text('Artesanías Colombianas', pageWidth / 2, 28, { align: 'center' });
  
  // Título de factura
  doc.setFontSize(18);
  doc.text('FACTURA DE COMPRA', pageWidth / 2, 45, { align: 'center' });
  
  // Información de pedido
  doc.setFontSize(10);
  doc.text(`Número de Orden: ${order.id}`, 15, 60);
  doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-CO')}`, 15, 67);
  doc.text(`Estado: ${getStatusLabel(order.status)}`, 15, 74);
  
  // Información de cliente
  doc.setFontSize(12);
  doc.text('INFORMACIÓN DE ENVÍO', 15, 90);
  doc.setFontSize(10);
  doc.text(order.shippingAddress.fullName || '', 15, 98);
  doc.text(order.shippingAddress.street || order.shippingAddress.address || '', 15, 104);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 15, 110);
  doc.text(`${order.shippingAddress.postalCode || order.shippingAddress.zipCode || ''}, ${order.shippingAddress.country}`, 15, 116);
  doc.text(`Tel: ${order.shippingAddress.phone}`, 15, 122);
  
  // Tabla de productos
  let y = 140;
  doc.setFontSize(12);
  doc.text('PRODUCTOS', 15, y);
  
  // Encabezados de tabla
  y += 10;
  doc.setFontSize(9);
  doc.text('Producto', 15, y);
  doc.text('Cant.', 120, y);
  doc.text('Precio', 145, y);
  doc.text('Total', 175, y);
  
  // Línea separadora
  y += 2;
  doc.line(15, y, pageWidth - 15, y);
  
  // Items
  y += 8;
  doc.setFontSize(9);
  order.items.forEach((item) => {
    const productName = item.product.name.length > 40 
      ? item.product.name.substring(0, 40) + '...' 
      : item.product.name;
    
    doc.text(productName, 15, y);
    doc.text(item.quantity.toString(), 120, y);
    doc.text(`$${item.price.toLocaleString('es-CO')}`, 145, y);
    doc.text(`$${(item.price * item.quantity).toLocaleString('es-CO')}`, 175, y);
    
    if (item.variant) {
      y += 5;
      doc.setFontSize(8);
      const variantInfo = [];
      if (item.variant.color) variantInfo.push(`Color: ${item.variant.color}`);
      if (item.variant.size) variantInfo.push(`Talla: ${item.variant.size}`);
      if (item.variant.material) variantInfo.push(`Material: ${item.variant.material}`);
      doc.text(variantInfo.join(', '), 20, y);
      doc.setFontSize(9);
    }
    
    y += 8;
    
    // Nueva página si es necesario
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Totales
  y += 5;
  doc.line(15, y, pageWidth - 15, y);
  y += 10;
  
  doc.text('Subtotal:', 130, y);
  doc.text(`$${order.subtotal.toLocaleString('es-CO')}`, 175, y);
  
  y += 7;
  doc.text('Envío:', 130, y);
  doc.text(`$${order.shipping.toLocaleString('es-CO')}`, 175, y);
  
  y += 7;
  doc.text('IVA (19%):', 130, y);
  doc.text(`$${order.tax.toLocaleString('es-CO')}`, 175, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.text('TOTAL:', 130, y);
  doc.text(`$${order.total.toLocaleString('es-CO')}`, 175, y);
  
  // Método de pago
  y += 15;
  doc.setFontSize(10);
  doc.text(`Método de pago: ${getPaymentMethodLabel(order.paymentMethod.type)}`, 15, y);
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.text('Ancestral heartbeat - Artesanías Colombianas', pageWidth / 2, footerY, { align: 'center' });
  doc.text('www.latidoancestral.com | contacto@latidoancestral.com', pageWidth / 2, footerY + 5, { align: 'center' });
  
  // Descargar PDF
  doc.save(`factura-${order.id}.pdf`);
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

function getPaymentMethodLabel(type: string): string {
  const labels: Record<string, string> = {
    card: 'Tarjeta de Crédito/Débito',
    paypal: 'PayPal',
    transfer: 'Transferencia Bancaria',
    cash_on_delivery: 'Contra Entrega',
  };
  return labels[type] || type;
}
