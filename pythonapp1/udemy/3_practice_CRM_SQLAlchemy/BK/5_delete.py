from sqlalchemy.sql import delete
from models import engine,customers

conn = engine.connect()
value2 = ('C002','鈴木B子',34,'女')
query = delete(customers).where(customers.c.customer_id=="C003")

conn.execute(query)
conn.close()