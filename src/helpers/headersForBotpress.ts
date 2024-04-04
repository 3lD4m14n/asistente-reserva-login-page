export const headersForBotpress = {
  "Content-type": "application/json",
  "x-bot-id": process.env.BOTPRESS_BOT_ID,
  Authorization: `Bearer ${process.env.BOTPRESS_TOKEN}`,
};
