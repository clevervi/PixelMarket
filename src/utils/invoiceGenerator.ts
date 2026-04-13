import jsPDF from 'jspdf';
import { Order } from '@/types';

export function generateInvoicePDF(order: Order): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text('PIXELMARKET NEXUS', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Premium Digital Assets & Infrastructure Ops', pageWidth / 2, 28, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('ACQUISITION INVOICE', pageWidth / 2, 45, { align: 'center' });
  
  // Order information
  doc.setFontSize(10);
  doc.text(`Nexus Ref ID: ${order.id}`, 15, 60);
  doc.text(`Execution Date: ${new Date(order.createdAt).toLocaleDateString('en-US')}`, 15, 67);
  doc.text(`Operational Status: ${getStatusLabel(order.status)}`, 15, 74);
  
  // Customer information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DEPLOYMENT COORDINATES', 15, 90);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(order.shippingAddress.fullName || '', 15, 98);
  doc.text(order.shippingAddress.street || order.shippingAddress.address || '', 15, 104);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 15, 110);
  doc.text(`${order.shippingAddress.postalCode || order.shippingAddress.zipCode || ''}, ${order.shippingAddress.country}`, 15, 116);
  doc.text(`Motive/Contact: ${order.shippingAddress.phone}`, 15, 122);
  
  // Products table
  let y = 140;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSET BUNDLE', 15, y);
  
  // Table headers
  y += 10;
  doc.setFontSize(9);
  doc.text('Asset Identification', 15, y);
  doc.text('Units', 120, y);
  doc.text('MSRP', 145, y);
  doc.text('Total', 175, y);
  
  // Separator line
  y += 2;
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(15, y, pageWidth - 15, y);
  
  // Line items
  y += 8;
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    const productName = item.product.name.length > 40 
      ? item.product.name.substring(0, 40) + '...' 
      : item.product.name;
    
    doc.text(productName, 15, y);
    doc.text(item.quantity.toString(), 120, y);
    doc.text(`$${item.price.toLocaleString('en-US')}`, 145, y);
    doc.text(`$${(item.price * item.quantity).toLocaleString('en-US')}`, 175, y);
    
    if (item.variant) {
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const variantInfo = [];
      if (item.variant.color) variantInfo.push(`Spec/Visual: ${item.variant.color}`);
      if (item.variant.size) variantInfo.push(`Scale: ${item.variant.size}`);
      if (item.variant.material) variantInfo.push(`Tech Stack: ${item.variant.material}`);
      doc.text(variantInfo.join(' | '), 20, y);
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
    }
    
    y += 8;
    
    // Add a new page if needed
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Totals
  y += 5;
  doc.line(15, y, pageWidth - 15, y);
  y += 10;
  
  doc.text('Subtotal:', 130, y);
  doc.text(`$${order.subtotal.toLocaleString('en-US')}`, 175, y);
  
  y += 7;
  doc.text('Logistics/Shipping:', 130, y);
  doc.text(`$${order.shipping.toLocaleString('en-US')}`, 175, y);
  
  y += 7;
  doc.text('VAT/Tax (19%):', 130, y);
  doc.text(`$${order.tax.toLocaleString('en-US')}`, 175, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ACREDITADO:', 130, y);
  doc.text(`$${order.total.toLocaleString('en-US')}`, 175, y);
  
  // Transaction Channel
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Transaction Channel: ${getPaymentMethodLabel(order.paymentMethod.type)}`, 15, y);
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('PIXELMARKET NEXUS - Engineering High-Performance Assets', pageWidth / 2, footerY, { align: 'center' });
  doc.text('www.pixelmarket.tech | ops@pixelmarket.tech', pageWidth / 2, footerY + 5, { align: 'center' });
  
  // Download PDF
  doc.save(`nexus-invoice-${order.id}.pdf`);
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Awaiting Fulfillment',
    processing: 'In Optimization',
    shipped: 'In Transit/Deploying',
    delivered: 'Successfully Initialized',
    cancelled: 'Operation Aborted',
  };
  return labels[status] || status;
}

function getPaymentMethodLabel(type: string): string {
  const labels: Record<string, string> = {
    card: 'Verified Credit/Debit Transaction',
    paypal: 'Express PayPal Terminal',
    transfer: 'Direct Ledger Transfer',
    cash_on_delivery: 'Endpoint Handover',
  };
  return labels[type] || type;
}
