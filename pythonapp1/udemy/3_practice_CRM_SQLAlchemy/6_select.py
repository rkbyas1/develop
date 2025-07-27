from models import engine,customers

conn = engine.connect()

# query = customers.select()\
#         .where(customers.c.customer_id=="C001")
query = customers.select()

result = conn.execute(query)
print(result.fetchall())

conn.close()