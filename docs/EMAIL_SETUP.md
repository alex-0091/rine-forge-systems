# Email Infrastructure & Deliverability Guide

To achieve high deliverability and safeguard domain reputation, follow this guide when transitioning from `DRY_RUN=true` to live sending.

---

## 1. Domain & DNS Authentication Checklist

Before sending cold B2B emails:

### SPF (Sender Policy Framework)
Add a TXT record to your DNS:
```text
v=spf1 include:mailgun.org ~all
```

### DKIM (DomainKeys Identified Mail)
Generate a 2048-bit DKIM keypair in your email provider (Mailgun/SendGrid/Resend) and publish the public key TXT record:
```text
k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...
```

### DMARC (Domain-based Message Authentication, Reporting & Conformance)
Publish DMARC policy at `_dmarc.yourdomain.com`:
```text
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100
```

### Custom Sending Subdomain
Do NOT send mass cold outreach from your primary corporate root domain. Use a dedicated outreach subdomain:
- `outreach.owais-ai.com` or `mail.owais-ai.com`

---

## 2. Rate Control & Warm-Up Schedule

Configure the RateController in `.env`:
```env
MAX_DAILY_EMAILS=25
MAX_HOURLY_EMAILS=5
MIN_SEND_DELAY_SECONDS=180
MAX_SEND_DELAY_SECONDS=600
```

Gradual volume progression:
- **Week 1**: 10 emails/day
- **Week 2**: 25 emails/day
- **Week 3**: 50 emails/day
- **Week 4+**: 100 emails/day (with multiple warmed mailboxes)
