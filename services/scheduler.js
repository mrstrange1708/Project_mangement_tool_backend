const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendReminderEmail } = require('./emailService');
const Project = require('../models/Project');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();
    // Calculate tomorrow's date range
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

    for (const project of projects) {
      let deadlineDate = project.deadline;
      if (typeof deadlineDate === 'string') {
        // Try to parse string deadline as date
        deadlineDate = new Date(deadlineDate);
      }
      if (
        deadlineDate instanceof Date &&
        !isNaN(deadlineDate) &&
        deadlineDate >= tomorrow &&
        deadlineDate < dayAfter
      ) {
        const subject = `Reminder: Project \"${project.title}\" deadline is tomorrow!`;
        const text = `Hey there! Don’t forget, your project \"${project.title}\" is due tomorrow (${deadlineDate.toLocaleDateString()}).`;
        const sent = await sendReminderEmail({
          to: project.userEmail,
          subject,
          text,
        });
        if (sent) {
          project.reminderSent = true;
          await project.save();
        }
      }
    }
  } catch (err) {
    console.error('Error in scheduler:', err);
  }
}); 