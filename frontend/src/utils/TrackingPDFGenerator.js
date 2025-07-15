
import { jsPDF } from 'jspdf';

class TrackingPDFGenerator {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.currentY = 20;
    this.lineHeight = 6;
  }

  // Initialize PDF document
  initializePDF() {
    this.doc = new jsPDF();
    this.currentY = this.margin;
  }

  // Add header with logo and title
  addHeader(trackingNumber) {
    const doc = this.doc;

    // Company header
    doc.setFillColor(16, 185, 129); // Emerald color
    doc.rect(0, 0, this.pageWidth, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('SHIPMENT TRACKING REPORT', this.margin, 15);

   doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text(`Generated on: ${new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`, this.pageWidth - 60, 15);


    this.currentY = 35;

    // Tracking number section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Tracking Number:', this.margin, this.currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(trackingNumber, this.margin + 50, this.currentY);

    this.currentY += 15;
  }

  // Add status section
  addStatusSection(shipment) {
    const doc = this.doc;

    // Status box
    doc.setFillColor(243, 244, 246);
    doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 25, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 25, 'S');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Current Status:', this.margin + 5, this.currentY + 5);

    // Status color based on status
    const statusColors = {
      'pending': [234, 179, 8], // yellow
      'picked_up': [59, 130, 246], // blue
      'in_transit': [249, 115, 22], // orange
      'out_for_delivery': [168, 85, 247], // purple
      'delivered': [34, 197, 94], // green
      'exception': [239, 68, 68] // red
    };

    const color = statusColors[shipment.status] || [107, 114, 128];
    doc.setTextColor(...color);
    doc.text(shipment.status.replace('_', ' ').toUpperCase(), this.margin + 45, this.currentY + 5);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (shipment.currentLocation) {
      doc.text(`Current Location: ${shipment.currentLocation}`, this.margin + 5, this.currentY + 12);
    }

    if (shipment.estimatedDelivery) {
      doc.text(`Estimated Delivery: ${new Date(shipment.estimatedDelivery).toLocaleDateString()}`, this.margin + 5, this.currentY + 18);
    }

    this.currentY += 35;
  }

  // Add sender and recipient information
  addContactSection(shipment) {
    const doc = this.doc;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Shipment Details', this.margin, this.currentY);
    this.currentY += 10;

    // Two column layout
    const leftCol = this.margin;
    const rightCol = this.pageWidth / 2 + 10;
    const colWidth = (this.pageWidth - 2 * this.margin - 20) / 2;

    // Sender section
    doc.setFillColor(239, 246, 255);
    doc.rect(leftCol, this.currentY - 3, colWidth, 35, 'F');
    doc.setDrawColor(191, 219, 254);
    doc.rect(leftCol, this.currentY - 3, colWidth, 35, 'S');

    doc.setTextColor(59, 130, 246);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM:', leftCol + 3, this.currentY + 3);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.sender.name, leftCol + 3, this.currentY + 9);

    doc.setFont('helvetica', 'normal');
    doc.text(shipment.sender.email, leftCol + 3, this.currentY + 15);
    doc.text(shipment.sender.phone, leftCol + 3, this.currentY + 21);

    // Handle long addresses
    const senderAddress = this.wrapText(shipment.sender.address, colWidth - 6);
    let addressY = this.currentY + 27;
    senderAddress.forEach(line => {
      doc.text(line, leftCol + 3, addressY);
      addressY += 4;
    });

    // Recipient section
    doc.setFillColor(236, 253, 245);
    doc.rect(rightCol, this.currentY - 3, colWidth, 35, 'F');
    doc.setDrawColor(167, 243, 208);
    doc.rect(rightCol, this.currentY - 3, colWidth, 35, 'S');

    doc.setTextColor(34, 197, 94);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TO:', rightCol + 3, this.currentY + 3);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.recipient.name, rightCol + 3, this.currentY + 9);

    doc.setFont('helvetica', 'normal');
    doc.text(shipment.recipient.email, rightCol + 3, this.currentY + 15);
    doc.text(shipment.recipient.phone, rightCol + 3, this.currentY + 21);

    const recipientAddress = this.wrapText(shipment.recipient.address, colWidth - 6);
    addressY = this.currentY + 27;
    recipientAddress.forEach(line => {
      doc.text(line, rightCol + 3, addressY);
      addressY += 4;
    });

    this.currentY += 45;
  }

  // Add package details
  addPackageDetails(shipment) {
    const doc = this.doc;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Package Information', this.margin, this.currentY);
    this.currentY += 10;

    // Package details table
    const tableData = [
      ['Description', shipment.packageDetails.description],
      ['Weight', `${shipment.packageDetails.weight} ${shipment.packageDetails.weightUnit}`],
      ['Dimensions', `${shipment.packageDetails.dimensions.length} × ${shipment.packageDetails.dimensions.width} × ${shipment.packageDetails.dimensions.height} ${shipment.packageDetails.dimensionUnit}`],
      ['Value', this.formatCurrency(shipment.packageDetails.value)],
      ['Category', shipment.packageDetails.category],
      ['Fragile', shipment.packageDetails.fragile ? 'Yes' : 'No']
    ];

    this.addTable(tableData, ['Property', 'Value']);
    this.currentY += 10;
  }

  // Add service details
  addServiceDetails(shipment) {
    const doc = this.doc;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Information', this.margin, this.currentY);
    this.currentY += 10;

    const tableData = [
      ['Service Type', shipment.serviceType],
      ['Priority', shipment.priority],
      ['Shipping Cost', this.formatCurrency(shipment.shippingCost)],
      ['Insurance', shipment.insurance ? this.formatCurrency(shipment.insurance.amount) : 'None'],
      ['Shipping Date', new Date(shipment.shippingDate).toLocaleDateString()],
      ['Signature Required', shipment.signatureRequired ? 'Yes' : 'No']
    ];

    if (shipment.specialInstructions) {
      tableData.push(['Special Instructions', shipment.specialInstructions]);
    }

    this.addTable(tableData, ['Property', 'Value']);
    this.currentY += 10;
  }

  // Add tracking history
  addTrackingHistory(shipment) {
    if (!shipment.trackingHistory || shipment.trackingHistory.length === 0) return;

    const doc = this.doc;

    // Check if we need a new page
    if (this.currentY > this.pageHeight - 80) {
      this.addNewPage();
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tracking History', this.margin, this.currentY);
    this.currentY += 10;

    const historyData = shipment.trackingHistory.map(event => [
      new Date(event.timestamp).toLocaleString(),
      event.status.replace('_', ' ').toUpperCase(),
      event.location,
      event.notes || '-'
    ]);

    this.addTable(historyData, ['Date & Time', 'Status', 'Location', 'Notes'], true);
  }

  // Add table helper method
  addTable(data, headers, isHistory = false) {
    const doc = this.doc;
    const startY = this.currentY;
    const rowHeight = 8;
    const colWidths = isHistory ? [40, 35, 50, 45] : [60, 110];

    // Table header
    doc.setFillColor(16, 185, 129);
    doc.rect(this.margin, startY, this.pageWidth - 2 * this.margin, rowHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    let currentX = this.margin + 2;
    headers.forEach((header, index) => {
      doc.text(header, currentX, startY + 5);
      currentX += colWidths[index];
    });

    // Table rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    data.forEach((row, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;

      // Check if we need a new page
      if (y > this.pageHeight - 30) {
        this.addNewPage();
        return;
      }

      // Alternating row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(this.margin, y, this.pageWidth - 2 * this.margin, rowHeight, 'F');
      }

      currentX = this.margin + 2;
      row.forEach((cell, cellIndex) => {
        const wrappedText = this.wrapText(String(cell), colWidths[cellIndex] - 4);
        doc.text(wrappedText[0], currentX, y + 5);
        currentX += colWidths[cellIndex];
      });
    });

    // Table border
    doc.setDrawColor(229, 231, 235);
    doc.rect(this.margin, startY, this.pageWidth - 2 * this.margin, (data.length + 1) * rowHeight, 'S');

    this.currentY = startY + (data.length + 1) * rowHeight + 5;
  }

  // Add new page
  addNewPage() {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  // Add footer
  addFooter() {
    const doc = this.doc;
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFillColor(243, 244, 246);
      doc.rect(0, this.pageHeight - 15, this.pageWidth, 15, 'F');

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - 30, this.pageHeight - 5);
      
      doc.text(`Report Date: ${new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`, this.pageWidth / 2 - 25, this.pageHeight - 5);

    }
  }

  // Helper method to wrap text
  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = this.doc.getTextWidth(testLine);

      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Helper method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Main method to generate PDF
  generatePDF(shipment) {
    this.initializePDF();

    this.addHeader(shipment.trackingNumber);
    this.addStatusSection(shipment);
    this.addContactSection(shipment);
    this.addPackageDetails(shipment);
    this.addServiceDetails(shipment);
    this.addTrackingHistory(shipment);
    this.addFooter();

    return this.doc;
  }

  // Method to download PDF
  downloadPDF(shipment, filename) {
    const doc = this.generatePDF(shipment);
    const fileName = filename || `tracking-${shipment.trackingNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  // Method to get PDF as blob
  getPDFBlob(shipment) {
    const doc = this.generatePDF(shipment);
    return doc.output('blob');
  }
}

export default TrackingPDFGenerator;
