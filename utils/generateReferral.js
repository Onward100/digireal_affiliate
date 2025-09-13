function generateReferralCode(name) {
  const prefix = name.split(" ")[0].toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${random}`;
}

module.exports = generateReferralCode;
