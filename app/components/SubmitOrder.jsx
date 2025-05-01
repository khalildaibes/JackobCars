const sendEmail = async () => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: orderDetails.name,
        orderDetails,
        cartItems,
        totalWithDelivery
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    alert('Thank you for your purchase!');
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Oops, we did not complete the purchase.');
  }
}; 