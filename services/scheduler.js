const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendReminderEmail } = require('./emailService');
const Project = require('../models/Project');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);

    // Find projects with reminderSent: false and userEmail set
    const projects = await Project.find({
      reminderSent: false,
      userEmail: { $exists: true, $ne: null },
    });

    console.log(`[Scheduler] Running at ${now.toISOString()}`);
    console.log(`[Scheduler] Found ${projects.length} projects to check for reminders.`);

    for (const project of projects) {
      let deadlineDate = project.deadline;
      if (typeof deadlineDate === 'string') {
        deadlineDate = new Date(deadlineDate);
        console.log(`[Scheduler] Parsed string deadline for project '${project.title}':`, deadlineDate);
      } else {
        console.log(`[Scheduler] Deadline for project '${project.title}':`, deadlineDate);
      }
      if (
        deadlineDate instanceof Date &&
        !isNaN(deadlineDate) &&
        deadlineDate >= tomorrow &&
        deadlineDate < dayAfter
      ) {
        console.log(`[Scheduler] Sending reminder for project: ${project.title}, deadline: ${deadlineDate}, email: ${project.userEmail}`);
        const subject = `Reminder: Project \"${project.title}\" deadline is tomorrow!`;
        const text = `Hey there! Don’t forget, your project \"${project.title}\" is due tomorrow (${deadlineDate.toLocaleDateString()}).`;
        const html = `
          <div style=\"font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px;\">
            <div style=\"max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;\">
              <h2 style=\"color: #2d7ff9; margin-bottom: 16px;\">⏰ Project Deadline Reminder</h2>
              <p style=\"font-size: 16px; color: #333;\">Hey there! 👋</p>
              <p style=\"font-size: 16px; color: #333;\">
                This is a friendly reminder that your project <b style=\"color: #2d7ff9;\">\"${project.title}\"</b> is due <b>tomorrow</b> (<b>${deadlineDate.toLocaleDateString()}</b>).
              </p>
              <p style=\"font-size: 15px; color: #666; margin-top: 32px;\">Stay productive!<br/>— TaskFlow Team</p>
            </div>
          </div>
        `;
        const sent = await sendReminderEmail({
          to: project.userEmail,
          subject,
          text,
          html,
        });
        if (sent) {
          console.log(`[Scheduler] Email sent successfully to ${project.userEmail}`);
          project.reminderSent = true;
          await project.save();
        } else {
          console.log(`[Scheduler] Failed to send email to ${project.userEmail}`);
        }
      } else {
        console.log(`[Scheduler] Project '${project.title}' deadline (${deadlineDate}) does not match tomorrow's window (${tomorrow} - ${dayAfter})`);
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error in scheduler:', err);
  }
}); 