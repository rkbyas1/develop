import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "sample.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query = "insert into items(item_name, price)\
        values('お茶', 150)"
# query = "insert into items(item_name)\
#         values('フライドチキン')"


cur.execute(query)
conn.commit()
conn.close()