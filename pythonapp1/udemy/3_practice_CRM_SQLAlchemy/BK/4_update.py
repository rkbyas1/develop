from sqlalchemy.sql import update
from models import engine,customers

conn = engine.connect()
value2 = ('C002','鈴木B子',34,'女')
query = update(customers).where(customers.c.customer_id=="C002").values(customer_name="鈴木B子",age=34)

conn.execute(query)
conn.close()