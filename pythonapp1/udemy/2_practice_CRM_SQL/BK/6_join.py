import sqlite3
import os
import pandas as pd

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query = "SELECT * FROM purchases\
        JOIN purchase_details\
        ON purchases.purchase_id=purchase_details.purchase_id"

df = pd.read_sql(query,conn)
print(df)
conn.commit()
conn.close()