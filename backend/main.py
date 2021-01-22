from typing import List
import databases
import sqlalchemy
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import urllib
from dotenv import load_dotenv
load_dotenv()
#DATABASE_URL = "sqlite:///./test.db"

host_server = os.environ.get('host_server')
db_server_port = urllib.parse.quote_plus(str(os.environ.get('db_server_port')))
database_name = os.environ.get('database_name')
db_username = urllib.parse.quote_plus(str(os.environ.get('db_username')))
db_password = urllib.parse.quote_plus(str(os.environ.get('db_password')))
ssl_mode = urllib.parse.quote_plus(str(os.environ.get('ssl_mode')))
DATABASE_URL = 'postgresql://{}:{}@{}:{}/{}?sslmode={}'.format(db_username, db_password, host_server, db_server_port, database_name, ssl_mode)

database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

# DB Tables
budget_totals = sqlalchemy.Table(
    "budget_totals",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("budget_bucket", sqlalchemy.String),
    sqlalchemy.Column("total_budget", sqlalchemy.Integer),
    sqlalchemy.Column("general_fund", sqlalchemy.Integer),
    sqlalchemy.Column("special_revenues", sqlalchemy.Integer),
    sqlalchemy.Column("grants", sqlalchemy.Integer),
    sqlalchemy.Column("notes", sqlalchemy.String)
)

# carceral_state = sqlalchemy.Table(
#     "carceral_state",
#     metadata,
#     sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
#     sqlalchemy.Column("department", sqlalchemy.String),
#     sqlalchemy.Column("budget_bucket", sqlalchemy.String),
#     sqlalchemy.Column("total_budget", sqlalchemy.Integer),
#     sqlalchemy.Column("general_fund", sqlalchemy.Integer),
#     sqlalchemy.Column("special_revenues", sqlalchemy.Integer),
#     sqlalchemy.Column("grants", sqlalchemy.Integer),
#     sqlalchemy.Column("notes", sqlalchemy.String)
# )

engine = sqlalchemy.create_engine(
    #DATABASE_URL, connect_args={"check_same_thread": False}
    DATABASE_URL, pool_size=3, max_overflow=0
)
metadata.create_all(engine)

class BudgetTotal(BaseModel):
    id: int
    budget_bucket: str
    general_fund: int
    special_revenues: int
    grants: int

# class Budget

# class LineItemIn(BaseModel):
#     department: str
#     total_budget: int
#     general_fund: int
#     special_revenues: int
#     grants: int
#     notes: str

# class LineItem(BaseModel):
#     id: int
#     department: str
#     budget_bucket: str
#     total_budget: int
#     general_fund: int
#     special_revenues: int
#     notes: str

app = FastAPI(title="People's Project Backend REST API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# @app.post("/carceral_state/", response_model=LineItem, status_code = status.HTTP_201_CREATED)
# async def create_line_item(line_item: LineItemIn):
#     query = carceral_state.insert().values(
#                 department=line_item.department,
#                 total_budget=line_item.total_budget,
#                 general_fund=line_item.general_fund,
#                 special_revenues=line_item.special_revenues,
#                 grants=line_item.grants,
#                 notes=line_item.notes,
#             )
#     last_record_id = await database.execute(query)
#     return {**carceral_state.dict(), "id": last_record_id}

# @app.put("/notes/{note_id}/", response_model=Note, status_code = status.HTTP_200_OK)
# async def update_note(note_id: int, payload: NoteIn):
#     query = notes.update().where(notes.c.id == note_id).values(
#         text=payload.text,
#         completed=payload.completed
#     )
#     await database.execute(query)
#     return {**payload.dict(), "id": note_id}

@app.get("/budget_totals/", response_model=List[BudgetTotal], status_code = status.HTTP_200_OK)
async def read_budget_totals(skip: int = 0, take: int = 20):
    query = budget_totals.select().offset(skip).limit(take)
    return await database.fetch_all(query)

# @app.get("/notes/{note_id}/", response_model=Note, status_code = status.HTTP_200_OK)
# async def read_notes(note_id: int):
#     query = notes.select().where(notes.c.id == note_id)
#     return await database.fetch_one(query)

# @app.delete("/notes/{note_id}/", status_code = status.HTTP_200_OK)
# async def delete_note(note_id: int):
#     query = notes.delete().where(notes.c.id == note_id)
#     await database.execute(query)
#     return {"message": "Note with id: {} deleted successfully!".format(note_id)}
