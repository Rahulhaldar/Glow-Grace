/**
 * Firebase Cloud Functions v2 - Automated 24-Hour Appointment Reminders
 * 
 * This script schedules a daily cron job that scans the 'appointments' collection in Firestore,
 * filters for confirmed appointments occurring exactly tomorrow, and automatically dispatches
 * personalized SMS (via Twilio) and Email (via Nodemailer) reminders to your clients.
 * 
 * Deployment Requirements:
 * 1. Navigate to the functions folder: `cd functions`
 * 2. Install dependencies: `npm install firebase-admin firebase-functions twilio nodemailer`
 * 3. Configure environment secrets in the Firebase console:
 *    `firebase functions:secrets:set TWILIO_ACCOUNT_SID=your_sid`
 *    `firebase functions:secrets:set TWILIO_AUTH_TOKEN=your_token`
 *    `firebase functions:secrets:set TWILIO_PHONE_NUMBER=your_number`
 *    `firebase functions:secrets:set SMTP_EMAIL=your_email`
 *    `firebase functions:secrets:set SMTP_PASSWORD=your_app_password`
 * 4. Deploy: `firebase deploy --only functions`
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

/**
 * Scheduled Function: runs daily at 9:00 AM (your local timezone)
 * to scan for upcoming appointments and dispatch notifications.
 */
exports.sendAutomatedReminders = onSchedule({
  schedule: '0 9 * * *', // Every day at 9:00 AM
  timeZone: 'Asia/Kolkata', // Set to salon's operating timezone
  memory: '256MiB',
  secrets: [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'SMTP_EMAIL',
    'SMTP_PASSWORD'
  ],
}, async (event) => {
  logger.info('Starting automated 24h appointment reminders scan...');

  // 1. Calculate the target date string for "Tomorrow" (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowStr = `${yyyy}-${mm}-${dd}`;

  logger.info(`Target Date to scan: ${tomorrowStr}`);

  try {
    // 2. Query Firestore for Confirmed appointments scheduled for tomorrow
    const apptSnapshot = await db.collection('appointments')
      .where('date', '==', tomorrowStr)
      .where('status', '==', 'Confirmed')
      .get();

    if (apptSnapshot.empty) {
      logger.info('No confirmed appointments found for tomorrow. Ending run.');
      return;
    }

    logger.info(`Found ${apptSnapshot.size} appointments to notify.`);

    // 3. Initialize communication clients lazily
    let smsClient = null;
    let mailTransporter = null;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
    }

    const notificationsQueue = [];

    // 4. Iterate over each tomorrow booking and queue notifications
    apptSnapshot.forEach((docSnap) => {
      const appt = docSnap.data();
      const bookingId = docSnap.id;

      logger.info(`Processing reminder for Booking #${bookingId} (Client: ${appt.customerName})`);

      // Personalized message bodies
      const smsBody = `Hi ${appt.customerName}, this is a reminder from Glow & Grace! Your scheduled appointment for '${appt.serviceName}' is tomorrow at ${appt.time}. We look forward to pampering you! Booking ID: ${bookingId}.`;
      
      const emailBody = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #F5DDE1; border-radius: 16px; background-color: #FFF9F7; color: #24191B;">
          <h2 style="color: #B85C72; text-align: center; margin-bottom: 20px;">Glow & Grace Sanctuary</h2>
          <p>Dear <strong>${appt.customerName}</strong>,</p>
          <p>We are absolutely thrilled to welcome you back to our sanctuary tomorrow!</p>
          <hr style="border: 0; border-top: 1px dashed #F5DDE1; margin: 20px 0;" />
          <p><strong>Your Appointment Details:</strong></p>
          <ul style="list-style: none; padding-left: 0;">
            <li style="margin-bottom: 8px;">👑 <strong>Treatment:</strong> ${appt.serviceName}</li>
            <li style="margin-bottom: 8px;">📅 <strong>Date:</strong> ${appt.date}</li>
            <li style="margin-bottom: 8px;">⏰ <strong>Time:</strong> ${appt.time}</li>
            <li style="margin-bottom: 8px;">🏷️ <strong>Booking Reference:</strong> #${bookingId}</li>
          </ul>
          <hr style="border: 0; border-top: 1px dashed #F5DDE1; margin: 20px 0;" />
          <p style="font-size: 13px; color: #7f6e71; font-style: italic; text-align: center;">If you need to reschedule, please call our front desk at least 4 hours in advance. See you soon!</p>
        </div>
      `;

      // Dispatch SMS Promise if Twilio is configured
      if (smsClient && appt.phone) {
        notificationsQueue.push(
          smsClient.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: appt.phone
          })
          .then((msg) => logger.info(`SMS sent successfully to ${appt.phone} (SID: ${msg.sid})`))
          .catch((err) => logger.error(`Failed to send SMS to ${appt.phone}:`, err))
        );
      } else {
        logger.warn(`Skipping SMS: Twilio credentials not configured, or client phone missing.`);
      }

      // Dispatch Email Promise if SMTP is configured
      if (mailTransporter && appt.email) {
        notificationsQueue.push(
          mailTransporter.sendMail({
            from: `"Glow & Grace Sanctuary" <${process.env.SMTP_EMAIL}>`,
            to: appt.email,
            subject: '👑 Tomorrow\'s Appointment Reminder - Glow & Grace',
            html: emailBody
          })
          .then(() => logger.info(`Email sent successfully to ${appt.email}`))
          .catch((err) => logger.error(`Failed to send Email to ${appt.email}:`, err))
        );
      } else {
        logger.warn(`Skipping Email: SMTP credentials not configured, or client email missing.`);
      }

      // 5. Save reminder log back to Firestore to avoid sending duplicate reminders on retries
      notificationsQueue.push(
        db.collection('sent_reminders').doc(bookingId).set({
          bookingId,
          customerName: appt.customerName,
          phone: appt.phone,
          email: appt.email,
          serviceName: appt.serviceName,
          remindedAt: admin.firestore.FieldValue.serverTimestamp(),
          targetDate: appt.date
        })
      );
    });

    // 6. Execute all queued tasks concurrently
    await Promise.all(notificationsQueue);
    logger.info('Automated 24-hour reminder job completed successfully.');
  } catch (error) {
    logger.error('Critical error in automated reminder cron job:', error);
  }
});
