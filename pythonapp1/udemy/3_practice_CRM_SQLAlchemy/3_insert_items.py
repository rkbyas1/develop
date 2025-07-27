import sqlalchemy.exc
from sqlalchemy.sql import Insert
from models import engine,customers,items
import sqlalchemy

itemList = [
    ('S001', 'お茶', 150),
    ('S002', 'おにぎり', 100),
    ('S003', 'サンドウィッチ', 300)
]


val_list = (
    {'item_id': 'S001', 
     'item_name': 'お茶', 
     'price':150,
    },
    {'item_id': 'S002', 
     'item_name': 'おにぎり', 
     'price': 100,
    }
)

conn = engine.connect()
for val in val_list:
    query = items.insert().values(val)

    try:
        result = conn.execute(query)
        if result.is_insert:
            print("登録成功!")
            print(f"キーは{result.inserted_primary_key[0]}です")
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反によるエラーです")

conn.close()
