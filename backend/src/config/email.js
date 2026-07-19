const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[Email] Using Ethereal test account:', testAccount.user);
  }
  return transporter;
};

const sendVerificationEmail = async (to, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const t = await getTransporter();
  const info = await t.sendMail({
    from: `"Bliss Nepal" <${process.env.SMTP_USER || 'noreply@blissnepal.com'}>`,
    to,
    subject: 'Verify your email - Bliss Nepal',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="color:#1a1a2e">Welcome to Bliss Nepal</h1>
        <p>Click the button below to verify your email address.</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0">Verify Email</a>
        <p style="color:#666;font-size:13px">Or copy this link: <br/><a href="${url}">${url}</a></p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">If you didn't create this account, ignore this email.</p>
      </div>
    `,
  });
  console.log('[Email] Verification sent to', to, 'Preview URL:', nodemailer.getTestMessageUrl(info));
  console.log('[Email] Direct link:', url);
  return { info, url };
};

module.exports = { sendVerificationEmail };
