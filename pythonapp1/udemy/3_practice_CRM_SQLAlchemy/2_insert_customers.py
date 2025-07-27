import sqlalchemy.exc
from sqlalchemy.sql import Insert
from models import engine,customers
import sqlalchemy

val_list = [
    {'customer_id': 'C008', 'customer_name': 'コバヤシA子', 'age': 64, 'gender': '女'},
]

conn = engine.connect()
for val in val_list:
    query = customers.insert().values(val)

    try:
        result = conn.execute(query)
        if result.is_insert:
            print("登録成功!")
            print(f"キーは{result.inserted_primary_key[0]}です")
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反によるエラーです")

conn.close()
