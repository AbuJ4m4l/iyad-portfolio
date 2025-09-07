const nodemailer = require("nodemailer");
require("dotenv").config();

// إنشاء Transporter مع إعدادات Zoho
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 587, // أو 465 للـ SSL
  secure: false, // true للمنفذ 465، false للمنفذ 587
  auth: {
    user: "iyad@rastan.shop",
    pass: "TfLretiznLVp",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// إعدادات بديلة للـ SSL (المنفذ 465)
const sslTransporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: "iyad@rastan.shop",
    pass: "TfLretiznLVp",
  },
});

// دالة لإرسال الإيميل
async function sendEmail() {
  try {
    const mailOptions = {
      from: "iyad@rastan.shop", // المرسل
      to: "msgamal563@gmail.com", // المستقبل
      cc: "cc@example.com", // اختياري - نسخة
      bcc: "bcc@example.com", // اختياري - نسخة مخفية
      subject: "عنوان الرسالة", // موضوع الرسالة
      text: "محتوى الرسالة النصي", // النص العادي
      html: `
                <h2>مرحباً!</h2>
                <p>هذه رسالة تجريبية من <strong>Zoho Mail</strong></p>
                <p>شكراً لك!</p>
            `, // محتوى HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("تم إرسال الإيميل بنجاح:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("خطأ في إرسال الإيميل:", error);
    return { success: false, error: error.message };
  }
}

// استدعاء الدالة
sendEmail();

// أو يمكنك تصديرها للاستخدام في ملف آخر
module.exports = { sendEmail, transporter };
