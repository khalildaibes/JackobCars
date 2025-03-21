import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, postTitle, postId } = body;

    // Prepare the template parameters
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
      post_title: postTitle,
      post_id: postId
    };

    // Send email using EmailJS
    await emailjs.send(
      'service_fiv09zs',
      'template_gtronog',
      templateParams,
      'XNc8KcHCQwchLLHG5'
    );

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 
