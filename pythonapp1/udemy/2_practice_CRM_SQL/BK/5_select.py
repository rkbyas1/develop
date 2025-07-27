import sqlite3
import os
import pandas as pd

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query = "SELECT * FROM items"
df = pd.read_sql(query,conn)
print(df)
cur.execute(query)
print(cur.fetchall())
conn.commit()
conn.close()