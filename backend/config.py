import os
from dotenv import load_dotenv
from supabase import create_client
from openai import OpenAI

load_dotenv()

supabase_client = create_client(
    os.getenv("SUPABASE_URL").strip(),
    os.getenv("SUPABASE_KEY").strip()
)

openai_client = OpenAI( 
  api_key=os.getenv("OPENAI_API_KEY").strip()
)
