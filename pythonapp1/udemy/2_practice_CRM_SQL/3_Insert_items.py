import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()


itemList = [
    ('S001', 'お茶', 150),
    ('S002', 'おにぎり', 100),
    ('S003', 'サンドウィッチ', 300)
]

for val in itemList:
    query = f"insert into items(item_id, item_name, price)\
        values{val}"
    cur.execute(query)

conn.commit()
conn.close()