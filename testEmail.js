import dotenv from 'dotenv';
import { sendEmail } from './src/utils/emailService.js';

dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'admin@carrental.com');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('\n❌ Email configuration is missing!');
    console.error('Please add the following to your .env file:');
    console.error('EMAIL_USER=your_gmail@gmail.com');
    console.error('EMAIL_PASSWORD=your_app_password');
    return;
  }

  try {
    const testHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #007bff;">🧪 Email Test</h1>
        <p>This is a test email from your Car Rental system.</p>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;

    const result = await sendEmail(
      process.env.EMAIL_USER, // Send to yourself for testing
      '🧪 Car Rental - Email Test',
      testHtml
    );

    if (result) {
      console.log('\n✅ Email test successful!');
      console.log('Check your inbox for the test email.');
    } else {
      console.log('\n❌ Email test failed!');
      console.log('Check the error messages above for details.');
    }
  } catch (error) {
    console.error('\n❌ Email test error:', error.message);
  }
};

testEmail(); 