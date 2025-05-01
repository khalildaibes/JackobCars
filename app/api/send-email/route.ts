import { NextResponse } from 'next/server';

// Initialize EmailJS
import emailjs from 'emailjs-com';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, time, message, title } = body;

    // Prepare the template parameters for the car contact request
    const templateParams = {
      title: title || 'New Car Contact Request',
      name: name,
      phone: phone,
      time: time,
      message: message,
      email: "blacklife4ever93@gmail.com"
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      'service_fiv09zs',
      'template_o7riedx', // Make sure this matches your template ID
      templateParams,
      'XNc8KcHCQwchLLHG5'
    );

    if (response.status === 200) {
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 
