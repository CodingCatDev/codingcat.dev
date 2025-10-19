import * as React from 'react';

interface EmailTemplateProps {
  fullName: string;
  email: string;
  companyName?: string;
  sponsorshipTier: string[];
  message?: string;
}

export function EmailTemplate({ 
  fullName,
  email,
  companyName,
  sponsorshipTier,
  message,
 }: EmailTemplateProps) {
    return (
        <div>
            <h1>New Sponsorship Request</h1>
            <p><strong>Full Name:</strong> {fullName}</p>
            <p><strong>Email:</strong> {email}</p>
            {companyName && <p><strong>Company Name:</strong> {companyName}</p>}
            <p><strong>Sponsorship Tiers:</strong></p>
            <ul>
                {sponsorshipTier.map((tier) => (
                    <li key={tier}>{tier}</li>
                ))}
            </ul>
            {message && <p><strong>Message:</strong></p>}
            {message && <p>{message}</p>}
        </div>
    );
}