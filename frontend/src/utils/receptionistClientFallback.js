/**
 * DEPRECATED - Removed in Rine Forge Phase 2
 * Fake client regex responses have been replaced with the real AI Core backend
 * (/api/v1/ai/chat and /api/v1/ai/chat/stream).
 */
export function processClientReceptionistMessage() {
  return {
    reply: "AI service is currently offline / no AI provider configured. Please configure an API key in settings.",
    intent: "OFFLINE_NOTICE",
    confidence: 1.0,
    requires_human: true,
    action: null
  };
}
