import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Create Nodemailer transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate user booking confirmation email HTML
const createUserEmailTemplate = (booking, car, user) => {
  const startDate = new Date(booking.startDate).toLocaleDateString();
  const endDate = new Date(booking.endDate).toLocaleDateString();
  const daysDiff = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: #007bff; margin-bottom: 10px;">🚗 Car Rental Booking Confirmation</h1>
        <p style="color: #6c757d; font-size: 18px;">Thank you for choosing our car rental service!</p>
      </div>
      
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Booking Details</h2>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">📋 Booking Information</h3>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Confirmed</span></p>
          <p><strong>Booking Date:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">🚙 Vehicle Information</h3>
          <p><strong>Car:</strong> ${car.brand} ${car.model}</p>
          <p><strong>Year:</strong> ${car.year}</p>
          <p><strong>Daily Rate:</strong> $${car.pricePerDay}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">📅 Rental Period</h3>
          <p><strong>Pickup Date:</strong> ${startDate}</p>
          <p><strong>Return Date:</strong> ${endDate}</p>
          <p><strong>Duration:</strong> ${daysDiff} day(s)</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">💰 Payment Information</h3>
          <p><strong>Total Amount:</strong> <span style="font-size: 20px; font-weight: bold; color: #28a745;">$${booking.totalPrice}</span></p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">📍 Location Details</h3>
          <p><strong>Pickup Location:</strong> ${booking.pickupLocation || 'N/A'}</p>
          ${booking.returnLocation ? `<p><strong>Return Location:</strong> ${booking.returnLocation}</p>` : ''}
        </div>
        
        ${booking.additionalServices && booking.additionalServices.length > 0 ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">🔧 Additional Services</h3>
          <ul style="list-style: none; padding: 0;">
            ${booking.additionalServices.map(service => `<li style="padding: 5px 0;">✅ ${service}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">📞 Contact Information</h3>
          <p><strong>Customer Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Support Email:</strong> support@carrental.com</p>
          <p><strong>Phone:</strong> ${booking.mobileNumber || 'N/A'}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">⚠️ Important Notes</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Please bring a valid driver's license and credit card</li>
            <li>Inspect the vehicle before pickup and report any damages</li>
            <li>Return the vehicle with the same fuel level as pickup</li>
            <li>Contact us immediately for any issues during your rental</li>
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d;">
        <p>Thank you for choosing our service!</p>
        <p>© 2024 CarRental. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Generate admin booking notification email HTML
const createAdminEmailTemplate = (booking, car, user) => {
  const startDate = new Date(booking.startDate).toLocaleDateString();
  const endDate = new Date(booking.endDate).toLocaleDateString();
  const daysDiff = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #dc3545; padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin-bottom: 10px;">🚗 New Booking Notification</h1>
        <p style="color: white; font-size: 18px;">A new booking has been created</p>
      </div>
      
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Booking Summary</h2>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">📋 Booking Information</h3>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Confirmed</span></p>
          <p><strong>Booking Date:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">👤 Customer Information</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>User ID:</strong> ${user._id}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">🚙 Vehicle Information</h3>
          <p><strong>Car:</strong> ${car.brand} ${car.model}</p>
          <p><strong>Year:</strong> ${car.year}</p>
          <p><strong>Car ID:</strong> ${car._id}</p>
          <p><strong>Daily Rate:</strong> $${car.pricePerDay}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">📅 Rental Period</h3>
          <p><strong>Pickup Date:</strong> ${startDate}</p>
          <p><strong>Return Date:</strong> ${endDate}</p>
          <p><strong>Duration:</strong> ${daysDiff} day(s)</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">💰 Financial Information</h3>
          <p><strong>Total Amount:</strong> <span style="font-size: 20px; font-weight: bold; color: #28a745;">$${booking.totalPrice}</span></p>
          <p><strong>Daily Revenue:</strong> $${car.pricePerDay}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #007bff;">📍 Location Details</h3>
          <p><strong>Pickup Location:</strong> ${booking.pickupLocation || 'N/A'}</p>
          ${booking.returnLocation ? `<p><strong>Return Location:</strong> ${booking.returnLocation}</p>` : ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">📞 Customer Mobile</h3>
          <p><strong>Mobile Number:</strong> ${booking.mobileNumber || 'N/A'}</p>
        </div>
        
        ${booking.additionalServices && booking.additionalServices.length > 0 ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #dc3545;">🔧 Additional Services</h3>
          <ul style="list-style: none; padding: 0;">
            ${booking.additionalServices.map(service => `<li style="padding: 5px 0;">✅ ${service}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #721c24; margin-top: 0;">⚡ Action Required</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Prepare the vehicle for pickup</li>
            <li>Ensure all documents are ready</li>
            <li>Verify customer's driver's license</li>
            <li>Process payment if not already done</li>
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d;">
        <p>This is an automated notification from CarRental System</p>
        <p>© 2024 CarRental. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Generate user booking cancellation email HTML
const createUserCancelEmailTemplate = (booking, car, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: #dc3545; margin-bottom: 10px;">🚗 Car Rental Booking Cancelled</h1>
        <p style="color: #721c24; font-size: 18px;">Your booking has been cancelled as per your request.</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Cancelled Booking Details</h2>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Cancelled</span></p>
        <p><strong>Car:</strong> ${car.brand} ${car.model} (${car.year})</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>Return Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6c757d;">
        <p>If you have any questions, please contact support@carrental.com</p>
        <p>© 2024 CarRental. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Generate admin booking cancellation notification email HTML
const createAdminCancelEmailTemplate = (booking, car, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: #dc3545; margin-bottom: 10px;">🚗 Booking Cancelled Notification</h1>
        <p style="color: #721c24; font-size: 18px;">A booking has been cancelled by the user.</p>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Cancelled Booking Summary</h2>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Cancelled</span></p>
        <p><strong>Car:</strong> ${car.brand} ${car.model} (${car.year})</p>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>Return Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6c757d;">
        <p>This is an automated notification from CarRental System</p>
        <p>© 2024 CarRental. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Send a single email
const sendEmail = async (to, subject, htmlContent) => {
  // eslint-disable-next-line
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
    return false;
  }
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed. Please check your internet connection.');
    }
    return false;
  }
};

// Send booking confirmation to user and admin
export const sendBookingEmails = async (booking, car, user) => {
  try {
    const userEmailTemplate = createUserEmailTemplate(booking, car, user);
    const userEmailSent = await sendEmail(
      user.email,
      '🚗 Car Rental Booking Confirmation',
      userEmailTemplate
    );

    const adminEmailTemplate = createAdminEmailTemplate(booking, car, user);
    const adminEmailSent = await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@carrental.com',
      '🚗 New Booking Notification - Admin',
      adminEmailTemplate
    );

    return {
      userEmailSent,
      adminEmailSent
    };
  } catch (error) {
    console.error('Error sending booking emails:', error);
    return {
      userEmailSent: false,
      adminEmailSent: false
    };
  }
};

// Send booking cancellation emails to user and admin
export const sendCancelBookingEmails = async (booking, car, user) => {
  try {
    const userEmailTemplate = createUserCancelEmailTemplate(booking, car, user);
    const userEmailSent = await sendEmail(
      user.email,
      '🚗 Car Rental Booking Cancelled',
      userEmailTemplate
    );

    const adminEmailTemplate = createAdminCancelEmailTemplate(booking, car, user);
    const adminEmailSent = await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@carrental.com',
      '🚗 Booking Cancelled Notification - Admin',
      adminEmailTemplate
    );

    return {
      userEmailSent,
      adminEmailSent
    };
  } catch (error) {
    console.error('Error sending cancellation emails:', error);
    return {
      userEmailSent: false,
      adminEmailSent: false
    };
  }
};

// Optionally export sendEmail for other uses
export default {
  sendEmail,
  sendBookingEmails,
  sendCancelBookingEmails
};

export const sendAdminRegistrationEmail = async (user) => {
  const htmlContent = `
    <h2>New User Registration</h2>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Username:</strong> ${user.username}</p>
  `;
  await sendEmail(
    process.env.ADMIN_EMAIL || 'admin@carrental.com',
    'New User Registration',
    htmlContent
  );
}; 