import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from './model/user.model';

const generateEmailTemplate = () => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"> 
      <img src="cid:logo" alt="Aims Code Quest 2.0" style="width: 100%; max-width: 300px; display: block; margin: 0 auto;"> 
      <h2 style="text-align: center; color: #444;">Thank You for Registering!</h2> 
      <p style="font-size: 16px; color: #555;"> 
        You have successfully registered for <strong>Aims Code Quest 2.0</strong>, our upcoming hackathon event. 
      </p> 
      <p style="font-size: 16px; color: #555;"> 
        📅 <strong>Date:</strong> Poush 4
        <br> 
        🕒 <strong>Time:</strong> 7:30 AM to 4:00 PM 
      </p>
      <p style="font-size: 16px; color: #555;"> 
        We are excited to have you join us for this thrilling coding experience. Prepare to code, compete, and collaborate! 
      </p>
      <p style="font-size: 16px; color: #555;"> 
        Additionally, we invite you to the <strong>Poush 5 Demo and Presentation</strong> on the following day: 
        <br> 📅 <strong>Date:</strong> Poush 5
        <br> 🕒 <strong>Time:</strong> 8:30 AM 
      </p>
      <p style="text-align: center; margin-top: 20px;"> 
        <strong>See you at the event!</strong> 
      </p> 
      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;"> 
      <p style="font-size: 12px; color: #999; text-align: center;"> 
        This email was sent by Aims Code Quest 2.0. For any inquiries, contact us at 
        <a href="mailto:support@aimscodequest.com">support@aimscodequest.com</a>. 
      </p>
    </div>
  `;
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password or email password
  },
});

const sendThankYouEmails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const users = await User.find().select('email');
    if (!users.length) {
      console.log('No users found.');
      return;
    }

    for (const user of users) {
      const mailOptions = {
        from: '"Aims Code Quest" <noreply@aimscodequest.com>',
        to: user.email,
        subject: 'Thank You for Registering for Aims Code Quest 2.0!',
        html: generateEmailTemplate(),
        attachments: [
          {
            filename: 'images.png',
            path: '/images.png', // Path to your logo image
            cid: 'logo', // Content ID referenced in the email template
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError.message);
      }
    }

    console.log('All emails processed.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

sendThankYouEmails();