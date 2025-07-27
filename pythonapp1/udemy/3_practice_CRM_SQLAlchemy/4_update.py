from sqlalchemy.sql import update
from models import engine,customers

conn = engine.connect()

value2 = ('C002', '佐藤B作', 66, '男')
query = update(customers).where(customers.c.customer_id == "C002").values(customer_name="佐藤B作", age=66)

conn.execute(query)

conn.close()