/**
 * Google Apps Script for AYP Tech Contact Form Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a Google Sheet and copy its ID
 * 5. Replace SHEET_ID below with your sheet ID
 * 6. Deploy as web app with execute permissions for "Anyone"
 * 7. Copy the web app URL and use it in google-sheets-integration.js
 */

// Configuration
const SHEET_ID = '1NgFigw0HWoZ1ELPwCA3ZTrqJLMEAppQEZP7kd4nvxco'; // Replace with your Google Sheet ID
const CONTACT_SHEET_NAME = 'Contact Forms';
const NEWSLETTER_SHEET_NAME = 'Newsletter Subscriptions';

/**
 * Main function to handle POST requests
 */
function doPost(e) {
  try {
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Determine which sheet to use based on source
    if (data.source === 'Newsletter') {
      return handleNewsletterSubmission(data);
    } else {
      return handleContactSubmission(data);
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to process request'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle contact form submissions
 */
function handleContactSubmission(data) {
  try {
    const sheet = getOrCreateSheet(CONTACT_SHEET_NAME, [
      'Timestamp',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Industry',
      'Service Interest',
      'Team Size',
      'Budget',
      'Timeline',
      'Message',
      'Newsletter Signup',
      'Source',
      'Page',
      'Status'
    ]);
    
    // Add the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.company,
      data.industry,
      data.service,
      data.teamSize,
      data.budget,
      data.timeline,
      data.message,
      data.newsletter,
      data.source,
      data.page,
      'New'
    ]);
    
    // Send notification email to admin (optional)
    sendAdminNotification(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Contact form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to submit contact form'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle newsletter subscriptions
 */
function handleNewsletterSubmission(data) {
  try {
    const sheet = getOrCreateSheet(NEWSLETTER_SHEET_NAME, [
      'Timestamp',
      'Email',
      'Source',
      'Page',
      'Status'
    ]);
    
    // Check if email already exists
    const existingData = sheet.getDataRange().getValues();
    const emailExists = existingData.some(row => row[1] === data.email);
    
    if (!emailExists) {
      sheet.appendRow([
        data.timestamp,
        data.email,
        data.source,
        data.page,
        'Subscribed'
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Newsletter subscription successful'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error handling newsletter subscription:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to subscribe to newsletter'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create a sheet with headers
 */
function getOrCreateSheet(sheetName, headers) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    // Add headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

/**
 * Send notification email to admin when new contact form is submitted
 */
function sendAdminNotification(data) {
  try {
    const adminEmail = 'contact@ayptech.com'; // Replace with your admin email
    const subject = `New Contact Form Submission - ${data.firstName} ${data.lastName}`;
    
    const body = `
New contact form submission received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Industry: ${data.industry}
Service Interest: ${data.service}
Team Size: ${data.teamSize}
Budget: ${data.budget}
Timeline: ${data.timeline}

Message:
${data.message}

Newsletter Signup: ${data.newsletter}
Source: ${data.source}
Page: ${data.page}
Timestamp: ${data.timestamp}

Please follow up within 2 hours as promised.
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'AYP Tech Contact Form API is working'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify setup
 */
function testSetup() {
  try {
    const testData = {
      timestamp: new Date().toISOString(),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      company: 'Test Company',
      industry: 'testing',
      service: 'test-service',
      teamSize: '1-10',
      budget: 'under-25k',
      timeline: 'immediately',
      message: 'This is a test submission',
      newsletter: 'yes',
      source: 'Contact Form',
      page: '/test'
    };
    
    handleContactSubmission(testData);
    console.log('Test submission successful');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

/**
 * Function to set up triggers (run once after deployment)
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // You can add time-based triggers here if needed
  // For example, to send weekly reports
}

/**
 * Generate weekly report of submissions
 */
function generateWeeklyReport() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(CONTACT_SHEET_NAME);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSubmissions = data.filter(row => {
      const timestamp = new Date(row[0]);
      return timestamp > oneWeekAgo;
    });
    
    if (recentSubmissions.length > 0) {
      const subject = `Weekly Contact Form Report - ${recentSubmissions.length} new submissions`;
      const body = `
Weekly report for AYP Tech contact forms:

Total submissions this week: ${recentSubmissions.length}

Recent submissions:
${recentSubmissions.map(row => `- ${row[1]} ${row[2]} (${row[3]}) - ${row[7]}`).join('\n')}

Please review and follow up as needed.
      `;
      
      MailApp.sendEmail('contact@ayptech.com', subject, body);
    }
    
  } catch (error) {
    console.error('Error generating weekly report:', error);
  }
}