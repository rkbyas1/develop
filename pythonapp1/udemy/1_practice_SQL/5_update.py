import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "sample.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query = "UPDATE items SET price=330 WHERE item_id=3"
# query = "UPDATE items SET price=120 WHERE item_name='おにぎり'"


cur.execute(query)
conn.commit()
conn.close()