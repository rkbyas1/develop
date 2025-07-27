import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "sample.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

# query = "alter TABLE items add quantity integer"
query = "alter TABLE items drop quantity"

cur.execute(query)
conn.commit()
conn.close()