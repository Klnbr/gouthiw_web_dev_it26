const admin = require("firebase-admin");

// ตรวจสอบว่า Firebase Admin SDK ได้ถูกตั้งค่าไว้หรือยัง
if (!admin.apps.length) {
  const serviceAccount = require("../src/gouthiwhealth-firebase-adminsdk-1g0pt-fe7590b861.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Function สำหรับส่งการแจ้งเตือน
 * @param {Array} tokens - Array ของ FCM Tokens
 * @param {string} title - หัวข้อการแจ้งเตือน
 * @param {string} body - ข้อความของการแจ้งเตือน
 */
const sendNotification = async (tokens, title, body) => {
  const payload = {
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log("Notifications sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
