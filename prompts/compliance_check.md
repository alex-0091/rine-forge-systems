# Compliance Check Prompt (v1.0)

Validate that an outbound email strictly satisfies commercial email regulations for the destination jurisdiction.

## Country Policies:
- **USA (CAN-SPAM)**: Requires valid physical postal address, clear non-deceptive header/subject, and functioning opt-out mechanism.
- **UK (PECR/GDPR)**: Requires legitimate interest B2B ground, clear sender identity, easy opt-out in every message.
- **Canada (CASL)**: B2B implied consent rules require message to be relevant to recipient's business role; valid contact info + unsubscribe mechanism.
- **Australia (Spam Act 2003)**: Strictly requires conspicuous publication OR prior business relationship relevant to recipient's duties; functional unsubscribe.
- **New Zealand (Unsolicited Electronic Messages Act)**: Relevant business B2B context, clear sender info, unsubscribe facility.
- **Singapore (Spam Control Act)**: Sender identification, label where applicable, working unsubscribe mechanism.
- **UAE (PDPL / TDRA)**: Transparent commercial identity and opt-out.
- **EU (GDPR / ePrivacy)**: Legitimate interest, role relevance, clear opt-out.

## Output Format (JSON):
```json
{
  "compliant": true,
  "jurisdiction": "USA",
  "checks": {
    "sender_identity_present": true,
    "physical_address_included": true,
    "optout_mechanism_included": true,
    "subject_non_deceptive": true,
    "b2b_role_relevant": true
  },
  "reasons": ["All CAN-SPAM requirements satisfied"]
}
```
