function parseMessage(message) {
  try {
    const item = JSON.parse(message);
    return item;
  } catch (e) {
    return message.toString();
  }
}

module.exports = {
  parseMessage,
};
