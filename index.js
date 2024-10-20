const TelegramBot = require('node-telegram-bot-api');
const token = require('./config/token');
const bot = new TelegramBot(token, { polling: true, port: 3000 });
const sheetService = require('./services/googlesheet');
const fs = require('fs');
const readUsernames = require("./utils/readusername");
const express = require('express');



// Create an Express application
const app = express();
const PORT = 3000;

// Route to check if the bot is running
app.get('/', (req, res) => {
  res.send('The Telegram bot is running!');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function readUsernames() {
  const data = fs.readFileSync('./data/usernames.json');
  return JSON.parse(data);
}
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;

  switch (callbackQuery.data) {
    case 'option1':
      bot.sendMessage(chatId, 'እባክዎ የተጠቃሚ ስምዎን ያስገቡ፡-');
      break;
    case 'option2':
      bot.sendMessage(chatId, 'አስተያየት ለመስጠት ምርጫውን መርጠዋል። እባክዎን አስተያየትዎን ከዚህ በታች ያስገቡ።');
      break;
    default:
      bot.sendMessage(chatId, 'ልክ ያልሆነ አማራጭ!');
  }
});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if ('text' in msg && msg.text.toString().toLowerCase() === '/start') {
    const menu = [
      [
        { text: 'የክፍያ ደብተሮን ይመልከቱ', callback_data: 'option1' },
        { text: 'አስተያየት ስጡ', callback_data: 'option2' }
      ],
    ];

    const replyMarkup = {
      inline_keyboard: menu
    };

    bot.sendMessage(chatId, 'አንድ አማራጭ ይምረጡ፡-', { reply_markup: replyMarkup });
  }

  // Check if the message is a username input
  if ('text' in msg && msg.text && !msg.text.startsWith('/start')) {
    const usernames = readUsernames();
    const user = usernames.find(u => u.username === msg.text);

    if (user) {
      const rowNumber = user.row || '1'; // Default to row 1 if not specified
      const data = await sheetService.readRowFromSheet(rowNumber);

      bot.sendMessage(chatId, data);
    } else {
      bot.sendMessage(chatId, 'የተጠቃሚ ስም አልተገኘም። እባክዎ እንደገና ይሞክሩ።');
    }
  }
});