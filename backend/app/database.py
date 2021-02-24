from typing import List, Dict
import databases
import urllib
import os
import sqlalchemy
from dotenv import load_dotenv
load_dotenv()

host_server = os.environ.get('host_server')
db_server_port = urllib.parse.quote_plus(str(os.environ.get('db_server_port')))
database_name = os.environ.get('database_name')
db_username = urllib.parse.quote_plus(str(os.environ.get('db_username')))
db_password = urllib.parse.quote_plus(str(os.environ.get('db_password')))
ssl_mode = urllib.parse.quote_plus(str(os.environ.get('ssl_mode')))
DATABASE_URL = 'postgresql://{}:{}@{}:{}/{}?sslmode={}'.format(db_username, db_password, host_server, db_server_port, database_name, ssl_mode)

metadata = sqlalchemy.MetaData()
engine = sqlalchemy.create_engine(
    #DATABASE_URL, connect_args={"check_same_thread": False}
    DATABASE_URL, pool_size=3, max_overflow=0
)
metadata.create_all(engine)

def instantiate_db():
    database = databases.Database(DATABASE_URL)
    return database

def create_budget_totals_table():
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

    return budget_totals


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