export async function sendWelcomeEmail(email: string, name: string, tempPassword?: string) {
    // In a real scenario, integrate with Resend, SendGrid, etc.
    // For now, we simulate the email sending by logging it.
    
    const subject = "Welcome to the Assessment Platform!";
    const body = `
      Hi ${name},
      
      Welcome to our platform! Your account has been created.
      
      ${tempPassword ? `Your temporary password is: ${tempPassword}\nPlease change it after logging in.` : "You can log in with your account credentials."}
      
      Best regards,
      The Team
    `;

    console.log(`[EMAIL SERVICE] Sending welcome email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Example Resend Integration:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: 'acme@resend.dev',
        to: email,
        subject,
        html: body.replace(/\n/g, '<br>')
    });
    */
    
    return true;
}
