# Troubleshooting & Common Issues

### 1. Emails Are Not Sending
- Check if `GLOBAL_KILL_SWITCH` is active.
- Check if `DRY_RUN=true`. In dry-run mode, emails are simulated and logged to the database without sending real SMTP packets.
- Verify if recipient is on the `suppression_list`.
- Check if daily or hourly rate limits have been reached (`MAX_DAILY_EMAILS`).

### 2. Australian Campaigns Show Paused
- Australia's Spam Act 2003 strictly regulates unsolicited commercial electronic messages. Campaigns targeting Australia are paused by default in the CountryPolicySystem until manual compliance approval is granted.

### 3. Gemini API Fallback
- If `GEMINI_API_KEY` is omitted or quota is exceeded, the system automatically engages the high-fidelity `MockLLMProvider` to ensure smooth pipeline execution without throwing 500 errors.

### 4. Database Locked (SQLite)
- Ensure all sessions are managed via FastAPI `Depends(get_db)`. For high concurrency, configure PostgreSQL via `DATABASE_URL`.
