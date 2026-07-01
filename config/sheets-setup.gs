// SXY's Corporate Club — Google Sheets Setup Script
// Run this once inside your Google Sheet to create all tabs and headers.
// Go to Extensions > Apps Script, paste this entire file, then click Run.

function setupSXYSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var tabs = [
    {
      name: 'Members',
      headers: [
        'Member ID',
        'Full Name',
        'Email',
        'Phone',
        'State',
        'Memberstack ID',
        'Membership Tier',
        'Join Date',
        'Billing Interval',
        'Status',
        'VIP Start Date',
        'Consecutive VIP Months',
        'Apprenticeship Eligible',
        'Source Site',
        'Notes'
      ]
    },
    {
      name: 'Bookings',
      headers: [
        'Booking ID',
        'Booking Date',
        'Session Date',
        'Session Time',
        'Client Name',
        'Client Email',
        'Phone',
        'State',
        'Is Existing Member',
        'Member Tier',
        'Session Type',
        'Calendly Event Name',
        'Upsell Email Sent',
        'Upsell Email Sent At',
        'Membership Page Redirect',
        'Converted to Member',
        'New Tier After Booking',
        'Source Site'
      ]
    },
    {
      name: 'Transactions',
      headers: [
        'Transaction ID',
        'Date',
        'Client Name',
        'Client Email',
        'Member ID',
        'Membership Tier',
        'Sale Type',
        'Item Description',
        'Sale Amount',
        'Fee Rate',
        'Platform Fee',
        'Net to Client',
        'Payment Status',
        'Source Site',
        'Zapier Trigger',
        'Notes'
      ]
    },
    {
      name: 'Retainers',
      headers: [
        'Retainer ID',
        'Client Name',
        'Client Email',
        'Member ID',
        'Membership Tier',
        'Retainer Type',
        'Monthly Rate',
        'Start Date',
        'Status',
        'Last Billed Date',
        'Next Bill Date',
        'Total Months Active',
        'Total Billed',
        'Notes'
      ]
    },
    {
      name: 'Boutique Orders',
      headers: [
        'Order ID',
        'Order Date',
        'Customer Name',
        'Customer Email',
        'Is Member',
        'Member Tier',
        'Product Name',
        'Quantity',
        'Order Total',
        'Fee Rate',
        'Platform Fee',
        'Net Revenue',
        'Fulfillment Provider',
        'Fulfillment Status',
        'Tracking Number',
        'Shopify Order Number',
        'Source Site'
      ]
    },
    {
      name: 'Revenue Summary',
      headers: [
        'Month',
        'Year',
        'Site',
        'Membership Revenue',
        'Retainer Revenue',
        'Boutique Revenue',
        'Strategy Session Revenue',
        'Club Directory Fees Collected',
        'Boutique Fees Collected',
        'Total Platform Fees',
        'Total Gross Revenue',
        'New Members',
        'Active Members',
        'New VIP Members',
        'Active Retainers',
        'Boutique Orders',
        'Strategy Sessions Booked'
      ]
    }
  ];

  var existingSheets = ss.getSheets();
  var existingNames = existingSheets.map(function(s) { return s.getName(); });

  tabs.forEach(function(tab, index) {
    var sheet;

    if (index < existingSheets.length) {
      sheet = existingSheets[index];
      sheet.setName(tab.name);
      sheet.clearContents();
    } else {
      sheet = ss.insertSheet(tab.name);
    }

    sheet.getRange(1, 1, 1, tab.headers.length).setValues([tab.headers]);

    var headerRange = sheet.getRange(1, 1, 1, tab.headers.length);
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  });

  SpreadsheetApp.getUi().alert('Setup complete! All 6 tabs have been created with headers.');
}
