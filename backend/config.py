import os
from dotenv import load_dotenv
from supabase import create_client
from openai import OpenAI

load_dotenv()


"""
supabase_client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

openai_client = OpenAI( 
  api_key=os.getenv("OPENAI_API_KEY")
)
"""

def _get_env_str(name: str, required: bool = True) -> str | None:
    value = os.getenv(name)
    if value is None:
        if required:
            raise ValueError(f"Missing required environment variable: {name}")
        return None
    value = value.strip()
    if required and not value:
        raise ValueError(f"Environment variable {name} is empty after trimming.")
    return value


SUPABASE_URL = _get_env_str("SUPABASE_URL")
SUPABASE_KEY = _get_env_str("SUPABASE_KEY")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# OpenAI key is optional for the scraper; only instantiate if present
OPENAI_API_KEY = _get_env_str("OPENAI_API_KEY", required=False)
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None