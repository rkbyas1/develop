import sqlite3
import os
import pandas as pd

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query = "SELECT \
        p.purchase_id,\
        p.customer_id,\
        p.date,\
        pd.item_id,\
        pd.quantity\
        FROM purchases as p\
        inner join purchase_details as pd\
        on p.purchase_id = pd.purchase_id"
df = pd.read_sql(query,conn)
print(df)

conn.commit()
conn.close()