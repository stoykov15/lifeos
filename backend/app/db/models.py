from sqlalchemy import (
    Table, Column, Integer, String, Boolean,
    Float, Text, ForeignKey, DateTime, JSON
)
from .database import metadata

# 🧑 USERS
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True, nullable=False),
    Column("password", String, nullable=False),
    Column("monthly_income", Float, default=0.0),
    Column("fixed_expenses", JSON, default={}),
    Column("currency", String, default="USD"),
    Column("dark_mode", Boolean, default=False),
    Column("goal", String, nullable=True),
    Column("setup_complete", Boolean, default = False),
    Column("first_name", String, nullable=True),
    Column("last_name", String, nullable=True),
)

# ✅ TASKS
tasks = Table(
    "tasks",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("title", String, nullable=False),
    Column("done", Boolean, default=False),
    Column("type", String, default="personal"),  # work | personal
    Column("priority", String, default="normal"),  # optional: low | normal | high
    Column("due_date", String, nullable=True),  # optional ISO date
)

# 💰 FINANCES
finances = Table(
    "finances",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("type", String, nullable=False),  # income | expense
    Column("category", String),
    Column("amount", Float, nullable=False),
    Column("note", String, nullable=True),
    Column("timestamp", DateTime, nullable=True),
)

# 🌐 RESOURCES
resources = Table(
    "resources",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("label", String),
    Column("type", String, default="article"),  # article | book | tool
    Column("url", String),
    Column("status", String, default="to_read"),  # to_read | reading | done
)

# 📅 PLANNER (Optional text per weekday)
planner = Table(
    "planner",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("day", String),  # e.g. Mon, Tue, ...
    Column("notes", Text),
)

# 📆 MEETINGS (optional future feature)
meetings = Table(
    "meetings",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("title", String),
    Column("datetime", String),
    Column("context", String, default="work"),  # work | personal
)
