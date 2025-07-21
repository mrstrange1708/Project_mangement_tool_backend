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

    const projects = await Project.find({
      deadline: { $gte: tomorrow, $lt: dayAfter },
      reminderSent: false,
      userEmail: { $exists: true, $ne: null },
    });
    for (const project of projects) {
      const subject = `Reminder: Project \"${project.title}\" deadline is tomorrow!`;
      const text = `Hey there! Don’t forget, your project \"${project.title}\" is due tomorrow (${project.deadline.toLocaleDateString()}).`;
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
  } catch (err) {
    console.error('Error in scheduler:', err);
  }
}); 