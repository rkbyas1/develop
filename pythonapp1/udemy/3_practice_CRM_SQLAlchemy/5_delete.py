from sqlalchemy.sql import delete
from models import engine,customers

conn = engine.connect()

value2 = ('C002', '佐藤B作', 66, '男')
query = delete(customers).where(customers.c.customer_id == "C003")

conn.execute(query)

conn.close()