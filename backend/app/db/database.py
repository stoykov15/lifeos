import os
from dotenv import load_dotenv
from databases import Database
from sqlalchemy import create_engine, MetaData

# Load from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
