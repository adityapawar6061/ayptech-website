/**
 * MINIMAL Google Apps Script for Testing
 * Use this to test if your deployment is working first
 */

// Your Google Sheet ID
const SHEET_ID = '1NgFigw0HWoZ1ELPwCA3ZTrqJLMEAppQEZP7kd4nvxco';

/**
 * Handle GET requests - for testing
 */
function doGet(e) {
  console.log('GET request received');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'AYP Tech Contact Form API is working',
      timestamp: new Date().toISOString(),
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  console.log('POST request received');
  console.log('Request data:', e);
  
  try {
    // Log the raw request
    if (e.postData) {
      console.log('Post data type:', e.postData.type);
      console.log('Post data contents:', e.postData.contents);
    }
    
    // Try to parse the data
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Parsed data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Invalid JSON data: ' + parseError.message
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Try to write to sheet
    try {
      const sheet = getOrCreateTestSheet();
      
      // Add a simple test row
      sheet.appendRow([
        new Date().toISOString(),
        data.firstName || 'Test',
        data.lastName || 'User',
        data.email || 'test@example.com',
        data.message || 'Test message',
        data.source || 'API Test',
        JSON.stringify(data)
      ]);
      
      console.log('Data written to sheet successfully');
      
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Data saved successfully',
          timestamp: new Date().toISOString(),
          dataReceived: data
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (sheetError) {
      console.error('Sheet error:', sheetError);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Sheet error: ' + sheetError.message,
          dataReceived: data
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('General error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Server error: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create test sheet
 */
function getOrCreateTestSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName('API Test');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet('API Test');
      
      // Add headers
      const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Message', 'Source', 'Raw Data'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    return sheet;
    
  } catch (error) {
    console.error('Error accessing sheet:', error);
    throw new Error('Cannot access Google Sheet: ' + error.message);
  }
}

/**
 * Test function you can run manually
 */
function testFunction() {
  try {
    console.log('Testing sheet access...');
    const sheet = getOrCreateTestSheet();
    
    sheet.appendRow([
      new Date().toISOString(),
      'Manual',
      'Test',
      'manual@test.com',
      'Manual test from Apps Script',
      'Manual Test',
      'Manual execution'
    ]);
    
    console.log('Manual test successful');
    return 'Test successful';
    
  } catch (error) {
    console.error('Manual test failed:', error);
    return 'Test failed: ' + error.message;
  }
}