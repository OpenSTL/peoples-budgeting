from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import os
import urllib
import json

from database import instantiate_db
from database import create_budget_totals_table
from models import BudgetTotal

app = FastAPI(title="People's Project Backend REST API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

database = instantiate_db()
budget_totals = create_budget_totals_table()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/budget_totals/", status_code = status.HTTP_200_OK)
async def read_budget_totals(skip: int = 0, take: int = 20):
    query = budget_totals.select().offset(skip).limit(take)
    return await database.fetch_all(query)

@app.get("/budget_totals/{budget_id}", response_model=BudgetTotal, status_code = status.HTTP_200_OK)
async def read_budget_total(budget_id: int):
    query = budget_totals.select().where(budget_totals.c.id == budget_id)
    return await database.fetch_one(query)
