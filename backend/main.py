from typing import List, Dict
import databases
import sqlalchemy
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import os
import urllib
from dotenv import load_dotenv
import json
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
    sqlalchemy.Column("budget_number", sqlalchemy.Integer),
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

# class BudgetData(BaseModel):
#     total_budget: str

# class BudgetBucket(BaseModel):
#     budget_bucket: Dict[str, int]

class BudgetTotal(BaseModel):
    id: int
    budget_number: int
    budget_bucket: str
    total_budget: int
    general_fund: int
    special_revenues: int
    grants: int

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

@app.get("/budget_totals/", status_code = status.HTTP_200_OK)
async def read_budget_totals(skip: int = 0, take: int = 20):
    response = []
    query = budget_totals.select().offset(skip).limit(take)
    data = await database.fetch_all(query)
    print(type(data))
    json_data = jsonable_encoder(data)
    for entry in data:
        new_json_data = {
            id: entry['id'],
            entry['budget_number']: {
                entry['budget_bucket']: {
                    'total_budget': entry['total_budget'],
                    'general_fund': entry['general_fund'],
                    'special_revenues': entry['special_revenues'],
                    'grants': entry['grants']
                },
            }
        }
        response.append(new_json_data)
    return data

@app.get("/budget_totals/{budget_id}", response_model=BudgetTotal, status_code = status.HTTP_200_OK)
async def read_budget_total(budget_id: int):
    query = budget_totals.select().where(budget_totals.c.id == budget_id)
    return await database.fetch_one(query)
