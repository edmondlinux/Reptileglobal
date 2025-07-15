import puppeteer from 'puppeteer';

class TrackingPDFGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
  }

  // Generate HTML content for the PDF
  generateHTML(shipment) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px 20px; text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .tracking-number { background: #f3f4f6; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; }
        .tracking-number h3 { color: #1f2937; margin-bottom: 10px; }
        .tracking-number p { color: #10b981; font-size: 20px; font-weight: bold; font-family: 'Courier New', monospace; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
        .detail-card { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .detail-card h4 { color: #1e40af; margin-bottom: 10px; font-size: 16px; }
        .detail-card p { margin-bottom: 5px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #10b981; color: white; font-weight: bold; }
        .status { text-transform: capitalize; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-in_transit { background: #fed7aa; color: #9a3412; }
        .status-delivered { background: #dcfce7; color: #166534; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>SHIPMENT TRACKING REPORT</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <!-- Tracking Number -->
        <div class="tracking-number">
          <h3>Tracking Number</h3>
          <p>${shipment.trackingNumber}</p>
        </div>

        <!-- Status -->
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px;">Current Status</h3>
          <p class="status status-${shipment.status}">${shipment.status.replace('_', ' ').toUpperCase()}</p>
          ${shipment.currentLocation ? `<p style="margin-top: 10px;"><strong>Current Location:</strong> ${shipment.currentLocation}</p>` : ''}
          ${shipment.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>

        <!-- Sender and Recipient -->
        <div class="details-grid">
          <div class="detail-card">
            <h4>From:</h4>
            <p><strong>${shipment.sender.name}</strong></p>
            <p>${shipment.sender.email}</p>
            <p>${shipment.sender.phone || ''}</p>
            <p>${shipment.sender.address}</p>
          </div>
          <div class="detail-card">
            <h4>To:</h4>
            <p><strong>${shipment.recipient.name}</strong></p>
            <p>${shipment.recipient.email}</p>
            <p>${shipment.recipient.phone || ''}</p>
            <p>${shipment.recipient.address}</p>
          </div>
        </div>

        <!-- Package Details -->
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px;">Package Information</h3>
          <table class="table">
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Description</td>
              <td>${shipment.packageDetails.description}</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>${shipment.packageDetails.weight} ${shipment.packageDetails.weightUnit || 'lbs'}</td>
            </tr>
            <tr>
              <td>Dimensions</td>
              <td>${shipment.packageDetails.dimensions ? 
                `${shipment.packageDetails.dimensions.length} × ${shipment.packageDetails.dimensions.width} × ${shipment.packageDetails.dimensions.height} ${shipment.packageDetails.dimensionUnit || 'in'}` : 'N/A'}</td>
            </tr>
            <tr>
              <td>Value</td>
              <td>${this.formatCurrency(shipment.packageDetails.value || 0)}</td>
            </tr>
            <tr>
              <td>Category</td>
              <td>${shipment.packageDetails.category || shipment.packageDetails.type || 'N/A'}</td>
            </tr>
            <tr>
              <td>Fragile</td>
              <td>${shipment.packageDetails.fragile ? 'Yes' : 'No'}</td>
            </tr>
          </table>
        </div>

        <!-- Service Details -->
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px;">Service Information</h3>
          <table class="table">
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Service Type</td>
              <td>${shipment.serviceType}</td>
            </tr>
            <tr>
              <td>Priority</td>
              <td>${shipment.priority}</td>
            </tr>
            <tr>
              <td>Shipping Cost</td>
              <td>${this.formatCurrency(shipment.shippingCost || 0)}</td>
            </tr>
            <tr>
              <td>Insurance</td>
              <td>${shipment.insurance && shipment.insurance.amount ? this.formatCurrency(shipment.insurance.amount) : 'None'}</td>
            </tr>
            <tr>
              <td>Shipping Date</td>
              <td>${shipment.shippingDate ? new Date(shipment.shippingDate).toLocaleDateString() : 'TBD'}</td>
            </tr>
            <tr>
              <td>Signature Required</td>
              <td>${shipment.signatureRequired ? 'Yes' : 'No'}</td>
            </tr>
            ${shipment.specialInstructions ? `
            <tr>
              <td>Special Instructions</td>
              <td>${shipment.specialInstructions}</td>
            </tr>` : ''}
          </table>
        </div>

        <!-- Tracking History -->
        ${shipment.trackingHistory && shipment.trackingHistory.length > 0 ? `
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px;">Tracking History</h3>
          <table class="table">
            <tr>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Location</th>
              <th>Notes</th>
            </tr>
            ${shipment.trackingHistory.map(event => `
            <tr>
              <td>${new Date(event.timestamp).toLocaleString()}</td>
              <td>${event.status.replace('_', ' ').toUpperCase()}</td>
              <td>${event.location}</td>
              <td>${event.notes || '-'}</td>
            </tr>
            `).join('')}
          </table>
        </div>` : ''}

        <!-- Footer -->
        <div class="footer">
          <p>© ${new Date().getFullYear()} GlobalLogistics. All rights reserved.</p>
          <p>Questions? Contact us at support@globallogistics.com</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Helper method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  // Method to get PDF as buffer (for Node.js)
  async getPDFBuffer(shipment) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      const html = this.generateHTML(shipment);

      await page.setContent(html);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

export default TrackingPDFGenerator;