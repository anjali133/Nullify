import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/** 
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<void>}
 */
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  try {
    const msg = {
      to,
      from: 'we.nullify@gmail.com',
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      throw new Error('Failed to send email due to an unknown error');
    }
  }
}
