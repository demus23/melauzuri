export function paymentApprovedEmail(name: string) {
  return `
    <h2>Payment Approved</h2>
    <p>Hello ${name},</p>
    <p>Your payment has been approved. You can now continue with your consultation.</p>
    <p>Thank you,<br/>Aninna Team</p>
  `;
}

export function consultationSubmittedEmail(name: string) {
  return `
    <h2>Consultation Submitted</h2>
    <p>Hello ${name},</p>
    <p>We received your consultation. Our specialist will review it and prepare your results.</p>
    <p>Thank you,<br/>Aninna Team</p>
  `;
}

export function resultsReadyEmail(name: string) {
  return `
    <h2>Your Results Are Ready</h2>
    <p>Hello ${name},</p>
    <p>Your consultation results are now ready. Please log in to your dashboard to view them.</p>
    <p>Thank you,<br/>Aninna Team</p>
  `;
}

export function courseAccessGrantedEmail(name: string, courseTitle: string) {
  return `
    <h2>Course Access Granted</h2>
    <p>Hello ${name},</p>
    <p>You now have access to: <strong>${courseTitle}</strong>.</p>
    <p>You can start learning from your dashboard.</p>
    <p>Thank you,<br/>Aninna Team</p>
  `;
}