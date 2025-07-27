import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

# 購入情報l
customer_id = 'C002'
date = '2024/04/02'
items = {
    "S002":2,
    "S003":2
}

# purchaseテーブル
state = (customer_id, date)
query = f"insert into purchases(customer_id, date)\
    values{state}"
cur.execute(query)

# purchase_detailテーブル
query = "SELECT * FROM purchases where purchase_id = (select max(purchase_id) from purchases)"
cur.execute(query)
latest_purchase_id = cur.fetchone()[0]

for item,qty in items.items():
    value = (latest_purchase_id, item, qty)
    query = f"insert into purchase_details(purchase_id, item_id, quantity)\
        values{value}"
    cur.execute(query)


conn.commit()
conn.close()