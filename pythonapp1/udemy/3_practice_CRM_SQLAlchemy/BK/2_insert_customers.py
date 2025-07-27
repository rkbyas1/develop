from sqlalchemy.sql import insert
from models import engine,customers
import sqlalchemy

value1 = {"customer_id":"C005",
"customer_name":"佐藤A子",
"age":64,
"gender":"女",
}

#1
query = customers.insert().values(value1)
#2
# query = insert(customers,values=value1) #sqlalchemy2.0ではエラーになります。

conn = engine.connect()

try:
    result = conn.execute(query)
    if result.is_insert:
        print("insert成功")
        print("inserted_primary_key:"+str(result.inserted_primary_key[0]))
except sqlalchemy.exc.IntegrityError:
    print("unique違反により、insert失敗")

# conn.commit() #sqlalchemy2.0では必要です。
conn.close()