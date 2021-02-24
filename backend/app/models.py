from pydantic import BaseModel

class BudgetTotal(BaseModel):
    id: int
    budget_number: int
    budget_bucket: str
    total_budget: int
    general_fund: int
    special_revenues: int
    grants: int
