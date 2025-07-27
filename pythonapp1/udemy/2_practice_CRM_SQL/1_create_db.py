import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

# customerテーブル
query1 = "CREATE TABLE IF NOT EXISTS customers(\
        customer_id string PRIMARY KEY,\
        customer_name STRING,\
        age INTEGER,\
        gender string)"
cur.execute(query1)

# itemテーブル
query2 = "CREATE TABLE IF NOT EXISTS items(\
        item_id string PRIMARY KEY,\
        item_name STRING,\
        price INTEGER)"
cur.execute(query2)

# purchasesテーブル
query3 = "CREATE TABLE IF NOT EXISTS purchases(\
        purchase_id integer PRIMARY KEY autoincrement,\
        customer_id STRING references customers(customer_id),\
        date datetime)"
cur.execute(query3)

# purchase_detailsテーブル
query4 = "CREATE TABLE IF NOT EXISTS purchase_details(\
        purchase_id integer references purchases(purchase_id),\
        item_id STRING references items(item_id),\
        quantity integer,\
        PRIMARY KEY(purchase_id,item_id))"
cur.execute(query4)


conn.commit()
conn.close()