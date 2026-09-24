import asyncio
import os
from dotenv import load_dotenv

# Load the newly created .env file
load_dotenv()

from backend.app.ai.gateway.providers.openai_provider import OpenAIProvider
from backend.app.ai.gateway.providers.gemini_provider import GeminiProvider

async def main():
    print("\n--- Rine Forge Systems Live AI Test ---")
    
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not openai_key and not gemini_key:
        print("ERROR: Neither OPENAI_API_KEY nor GEMINI_API_KEY found in .env!")
        print("Please paste your key into the .env file and run this script again.")
        return

    try:
        if openai_key:
            print(f"Testing OpenAI connection (Key found: sk-...{openai_key[-4:]})")
            provider = OpenAIProvider()
            # In Rine Forge, the provider usually takes 'messages'
            # We'll just manually call the provider's completion or use the raw SDK if needed
            response = await provider.generate_text("Say 'Hello from OpenAI, Rine Forge is live!'")
            print(f"OpenAI Response: {response.get('text', response)}")
            
        elif gemini_key:
            print(f"Testing Gemini connection (Key found: ...{gemini_key[-4:]})")
            provider = GeminiProvider()
            response = await provider.generate_text("Say 'Hello from Gemini, Rine Forge is live!'")
            print(f"Gemini Response: {response.get('text', response)}")
            
    except Exception as e:
        print(f"ERROR connecting to AI provider: {e}")

if __name__ == "__main__":
    asyncio.run(main())
