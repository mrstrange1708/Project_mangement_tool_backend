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
      }
      if (
        deadlineDate instanceof Date &&
        !isNaN(deadlineDate) &&
        deadlineDate >= tomorrow &&
        deadlineDate < dayAfter
      ) {
        console.log(`[Scheduler] Sending reminder for project: ${project.title}, deadline: ${deadlineDate}, email: ${project.userEmail}`);
        const subject = `Reminder: Project "${project.title}" deadline is tomorrow!`;
        const text = `Hey there! Don’t forget, your project "${project.title}" is due tomorrow (${deadlineDate.toLocaleDateString()}).`;
        const sent = await sendReminderEmail({
          to: project.userEmail,
          subject,
          text,
        });
        if (sent) {
          console.log(`[Scheduler] Email sent successfully to ${project.userEmail}`);
          project.reminderSent = true;
          await project.save();
        } else {
          console.log(`[Scheduler] Failed to send email to ${project.userEmail}`);
        }
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error in scheduler:', err);
  }
}); 