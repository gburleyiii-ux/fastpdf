import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message too short').max(5000, 'Message too long'),
  type: z.enum(['support', 'general', 'feedback', 'privacy', 'legal']),
  // Honeypot field for spam prevention
  website: z.string().max(10).optional(),
});

// Email routing map
const recipientMap: Record<string, string> = {
  support: 'support@fastpdf.app',
  general: 'hello@fastpdf.app',
  feedback: 'feedback@fastpdf.app',
  privacy: 'privacy@fastpdf.app',
  legal: 'legal@fastpdf.app',
};

// Template selector
const getTemplate = (type: string, name?: string) => {
  switch (type) {
    case 'support':
      return emailTemplates.supportAutoReply(name);
    case 'feedback':
      return emailTemplates.feedbackAutoReply(name);
    case 'privacy':
      return emailTemplates.privacyAutoReply(name);
    case 'legal':
      return emailTemplates.legalAutoReply(name);
    default:
      return emailTemplates.generalAutoReply(name);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message, type, website } = result.data;

    // Honeypot check - if website field is filled, it's likely spam
    if (website) {
      // Silently accept but don't send email
      return NextResponse.json({ success: true });
    }

    const recipient = recipientMap[type];

    // 1. Send notification to internal team
    await sendEmail({
      to: recipient,
      from: `FastPDF Contact Form <${recipient}>`,
      replyTo: email,
      subject: `[${type.toUpperCase()}] ${subject || 'New Contact Form Submission'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name || 'Anonymous'} (${email})</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      `,
    });

    // 2. Send auto-reply to user
    const template = getTemplate(type, name);
    await sendEmail({
      to: email,
      from: `${recipient.split('@')[0].charAt(0).toUpperCase() + recipient.split('@')[0].slice(1)} Team <${recipient}>`,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
