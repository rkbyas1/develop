import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

#購入情報
customer_id = "C003"
date = "2022/01/03"
items = {
    "S002":1,
    "S003":2,
}

# purchasesテーブルへの挿入
value = (customer_id,date)
query = f"INSERT INTO purchases(customer_id,date) VALUES{value}"
cur.execute(query)

# purchase_detailsテーブルへの挿入
query = "SELECT * FROM purchases WHERE purchase_id=(select max(purchase_id) from purchases)"
cur.execute(query)
latest_purchase_id = cur.fetchone()[0]

for item,quantity in items.items():
    value=(latest_purchase_id,item,quantity)
    query = f"INSERT INTO purchase_details(purchase_id,item_id,quantity) VALUES{value}"
    cur.execute(query)


conn.commit()
conn.close()