import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

value1 = ('S001','お茶',150)
value2 = ('S002','おにぎり',100)
value3 = ('S003','サンドイッチ',400)

query = f"INSERT INTO items(item_id,item_name,price) VALUES{value3}"


cur.execute(query)
conn.commit()
conn.close()