# Google Sheets Integration Setup Guide

## Overview
This guide will help you connect your AYP Tech website contact forms to Google Sheets so that all form submissions are automatically stored in a spreadsheet.

## Step-by-Step Setup

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "AYP Tech Contact Forms"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - Sheet ID: `1ABC123DEF456GHI789JKL`

### 2. Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js`
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
6. Replace `contact@ayptech.com` with your actual email address
7. Save the project (Ctrl+S) and name it "AYP Tech Form Handler"

### 3. Deploy the Script
1. Click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following:
   - Description: "AYP Tech Contact Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/ABC123.../exec`)

### 4. Update Your Website
1. Open `google-sheets-integration.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
3. Add this script to your HTML files:

```html
<!-- Add this before closing </body> tag in all HTML files -->
<script src="google-sheets-integration.js"></script>
```

### 5. Test the Integration
1. Go to your contact page
2. Fill out and submit the contact form
3. Check your Google Sheet - you should see the data appear
4. Check your email for the admin notification

## What Gets Stored

### Contact Form Data:
- Timestamp
- First Name & Last Name
- Email & Phone
- Company & Industry
- Service Interest
- Team Size & Budget
- Timeline & Message
- Newsletter Signup
- Source & Page
- Status

### Newsletter Subscriptions:
- Timestamp
- Email
- Source & Page
- Status

## Features Included

### ✅ Automatic Data Storage
- All form submissions stored in Google Sheets
- Separate sheets for contact forms and newsletter subscriptions
- Automatic header creation and formatting

### ✅ Email Notifications
- Admin receives email notification for each contact form submission
- Weekly summary reports (optional)
- Confirmation emails to users (optional)

### ✅ Duplicate Prevention
- Newsletter subscriptions check for existing emails
- Prevents duplicate entries

### ✅ Error Handling
- Graceful error handling with user feedback
- Fallback options if submission fails
- Detailed error logging

### ✅ User Experience
- Loading states during submission
- Success/error notifications
- Form validation
- Mobile-friendly interface

## Customization Options

### Email Templates
You can customize the admin notification email by editing the `sendAdminNotification` function in the Google Apps Script.

### Additional Fields
To add more form fields:
1. Add the field to your HTML form
2. Update the headers array in `handleContactSubmission`
3. Add the field to the `sheet.appendRow` call

### Automated Reports
Set up time-based triggers in Google Apps Script to send:
- Daily summaries
- Weekly reports
- Monthly analytics

## Security & Privacy

### Data Protection
- All data is stored in your private Google Sheet
- Only you have access to the submissions
- HTTPS encryption for all data transmission

### Spam Prevention
- Form validation prevents empty submissions
- Rate limiting can be added if needed
- Honeypot fields can be implemented

## Troubleshooting

### Common Issues:

**Form not submitting:**
- Check the Web App URL is correct
- Ensure the script is deployed with "Anyone" access
- Check browser console for errors

**Data not appearing in sheet:**
- Verify the Sheet ID is correct
- Check if the script has permission to access the sheet
- Look at the Apps Script execution log

**Email notifications not working:**
- Verify the admin email address is correct
- Check Gmail spam folder
- Ensure the script has email permissions

### Testing:
1. Use the `testSetup()` function in Google Apps Script
2. Check the execution log for errors
3. Test with different browsers and devices

## Support
If you need help with the setup:
1. Check the Google Apps Script execution log
2. Verify all URLs and IDs are correct
3. Test each step individually
4. Contact support if issues persist

## Next Steps
Once set up, you can:
- Create automated follow-up sequences
- Integrate with CRM systems
- Set up advanced analytics
- Add more form types
- Implement A/B testing

---

**Note:** Keep your Web App URL and Sheet ID secure. Don't share them publicly as they provide access to your form data.