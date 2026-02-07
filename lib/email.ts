import { Resend } from 'resend';

// Lazy initialization - only create client when needed
let resendInstance: Resend | null = null;

const getResend = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'FastPDF <hello@fastpdf.app>',
  replyTo,
}: SendEmailOptions) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

// Predefined email templates
export const emailTemplates = {
  supportAutoReply: (name?: string) => ({
    subject: 'We received your support request - FastPDF',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastPDF Support</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">📄 FastPDF</h1>
  </div>
  
  <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0; color: #1f2937;">We received your support request!</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Thanks for reaching out. We've received your message and our team is on it.</p>
    <p><strong>What happens next?</strong></p>
    <ul>
      <li>We typically respond within 24 hours on weekdays</li>
      <li>For Pro users, we prioritize your requests</li>
      <li>Check your spam folder if you don't hear back</li>
    </ul>
  </div>
  
  <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 24px;">
    <p style="margin: 0; font-size: 14px;">
      <strong>Quick tip:</strong> Check our <a href="https://fastpdf.app/help" style="color: #2563eb;">Help Center</a> for instant answers to common questions.
    </p>
  </div>
  
  <p style="color: #6b7280; font-size: 14px;">
    FastPDF Team<br>
    <a href="https://fastpdf.app" style="color: #2563eb;">fastpdf.app</a>
  </p>
</body>
</html>`,
  }),

  feedbackAutoReply: (name?: string) => ({
    subject: 'Thank you for your feedback! - FastPDF',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FastPDF Feedback</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #22c55e; margin: 0;">💚 Thank You!</h1>
  </div>
  
  <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0; color: #166534;">Your feedback means the world to us</h2>
    <p>Hi ${name || 'there'},</p>
    <p>We received your feedback about FastPDF. Seriously, thank you for taking the time to share your thoughts.</p>
    <p>Every suggestion helps us make FastPDF better for everyone. We read every message, even if we can't respond to each one personally.</p>
    <p>If your idea makes it into the product, we'll definitely let you know!</p>
  </div>
  
  <p style="color: #6b7280; font-size: 14px;">
    Thanks for being awesome,<br>
    The FastPDF Team
  </p>
</body>
</html>`,
  }),

  privacyAutoReply: (name?: string) => ({
    subject: 'Your privacy inquiry has been received - FastPDF',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FastPDF Privacy</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">🔒 Privacy Team</h1>
  </div>
  
  <div style="background: #faf5ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0; color: #5b21b6;">Your privacy inquiry has been received</h2>
    <p>Hi ${name || 'there'},</p>
    <p>We've received your privacy-related inquiry. This is important to us.</p>
    <p><strong>Response time:</strong></p>
    <ul>
      <li>GDPR/data requests: Within 30 days (usually much faster)</li>
      <li>General privacy questions: Within 48 hours</li>
      <li>Security concerns: Immediate priority</li>
    </ul>
    <p>If this is urgent (security issue, data breach concern), please reply with "URGENT" in the subject line.</p>
  </div>
  
  <div style="background: #f3f4f6; border-radius: 8px; padding: 16px;">
    <p style="margin: 0; font-size: 13px; color: #6b7280;">
      <strong>Remember:</strong> FastPDF processes all PDFs locally in your browser. 
      We literally cannot see your files. Read more in our 
      <a href="https://fastpdf.app/privacy" style="color: #7c3aed;">Privacy Policy</a>.
    </p>
  </div>
  
  <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
    FastPDF Privacy Team<br>
    <a href="mailto:privacy@fastpdf.app" style="color: #7c3aed;">privacy@fastpdf.app</a>
  </p>
</body>
</html>`,
  }),

  legalAutoReply: (name?: string) => ({
    subject: 'Legal correspondence received - FastPDF',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FastPDF Legal</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #dc2626; margin: 0;">⚖️ Legal Department</h1>
  </div>
  
  <div style="background: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0; color: #991b1b;">Legal correspondence received</h2>
    <p>This is an automated acknowledgment that your legal inquiry has been received.</p>
    <p><strong>Important notes:</strong></p>
    <ul>
      <li>This mailbox is monitored by our legal team</li>
      <li>Response time: 3-5 business days for non-urgent matters</li>
      <li>For DMCA notices: Please include all required elements per 17 U.S.C. § 512</li>
      <li>For subpoenas: Please attach a valid court order</li>
    </ul>
  </div>
  
  <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
    FastPDF Legal Team
  </p>
</body>
</html>`,
  }),

  generalAutoReply: (name?: string) => ({
    subject: 'Thanks for reaching out - FastPDF',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FastPDF</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">📄 FastPDF</h1>
  </div>
  
  <div style="background: #faf5ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0; color: #5b21b6;">Thanks for reaching out!</h2>
    <p>Hi ${name || 'there'},</p>
    <p>We've received your message and will get back to you soon.</p>
    <p>For partnership inquiries, we'll typically respond within 2-3 business days.</p>
  </div>
  
  <p style="color: #6b7280; font-size: 14px;">
    FastPDF Team<br>
    <a href="https://fastpdf.app" style="color: #7c3aed;">fastpdf.app</a>
  </p>
</body>
</html>`,
  }),
};
