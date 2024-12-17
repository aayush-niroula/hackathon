import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from './model/user.model.js';

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
        There will also be a <strong>Demo and Presentation</strong> session the following day:
        <br> 📅 <strong>Date:</strong> Poush 5
        <br> 🕒 <strong>Time:</strong> 8:30 AM 
      </p>
      <p style="text-align: center; margin-top: 20px;"> 
        <strong>See you at the event!</strong> 
      </p> 
      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;"> 
      <p style="font-size: 12px; color: #999; text-align: center;"> 
        This email was sent by Aims Code Quest 2.0. For any inquiries, contact us at 
        <a href="mailto:karki.aayush2003@gmail.com">support@aimscodequest.com</a>. 
      </p>
    </div>
  `;
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'karki.aayush2003@gmail.com',
    pass: 'bbbb ljdi nsgr oueo',
  },
});

const sendThankYouEmails = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://aayushniroula645:aayush@cluster0.0wgoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: 'hackathon' });
    console.log('MongoDB connected successfully.');

    // Fetch users who have not received the email
    const users = await User.find({ emailSent: { $ne: true } });
    console.log(`Fetched ${users.length} unsent users from the database.`);

    for (const user of users) {
      const mailOptions = {
        from: '"Aims Code Quest" <noreply@aimscodequest.com>',
        to: user.email,
        subject: 'Thank You for Registering for Aims Code Quest 2.0!',
        html: generateEmailTemplate(),
        attachments: [
          {
            filename: 'images.png',
            path: './images.png', // Path to your logo image
            cid: 'logo', // Content ID referenced in the email template
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to: ${user.email}`);

        // Update the emailSent field to true
        await User.updateOne({ _id: user._id }, { emailSent: true });
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
      }
    }

    console.log('✅ All emails processed.');
  } catch (err) {
    console.error('❌ Error occurred:', err.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};


// Start the email process
sendThankYouEmails();
