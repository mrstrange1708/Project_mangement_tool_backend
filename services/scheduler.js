const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendReminderEmail } = require('./emailService');
const Task = require('../models/Task');


cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      reminderTime: { $lte: now },
      reminderSent: false,
      userEmail: { $exists: true, $ne: null },
    });
    for (const task of tasks) {
      const subject = `Reminder: Finish \"${task.title}\"`;
      const text = `Hey there! Don’t forget to complete \"${task.title}\" before ${task.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today.`;
      const sent = await sendReminderEmail({
        to: task.userEmail,
        subject,
        text,
      });
      if (sent) {
        task.reminderSent = true;
        await task.save();
      }
    }
  } catch (err) {
    console.error('Error in scheduler:', err);
  }
}); 