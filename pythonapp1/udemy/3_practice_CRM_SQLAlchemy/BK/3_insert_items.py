from sqlalchemy.sql import insert
from models import engine,customers,items
import sqlalchemy


value1 = (
    {
    "item_id":"S003",
    "item_name":"お茶",
    "price":150,
    },
    {
    "item_id":"S004",
    "item_name":"おにぎり",
    "price":100,
    },
)
#1
query = items.insert().values(value1)
#2
# query = insert(customers,values=value1) #sqlalchemy2.0ではエラーになります。

conn = engine.connect()

try:
    result = conn.execute(query)
    if result.is_insert:
        print("insert成功")
except sqlalchemy.exc.IntegrityError:
    print("unique違反により、insert失敗")

conn.commit() #sqlalchemy2.0では必要です。
conn.close()