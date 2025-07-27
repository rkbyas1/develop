import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

query1 = "CREATE TABLE IF NOT EXISTS customers(\
        customer_id STRING PRIMARY KEY,\
        customer_name STRING,\
        age INTEGER,\
        gender STRING)"

cur.execute(query1)

query2 = "CREATE TABLE IF NOT EXISTS items(\
        item_id STRING PRIMARY KEY,\
        item_name STRING,\
        price INTEGER)"

cur.execute(query2)

query3 = "CREATE TABLE IF NOT EXISTS purchases(\
        purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,\
        customer_id STRING REFERENCES customers(customer_id),\
        date DATETIME)"

cur.execute(query3)

query4 = "CREATE TABLE IF NOT EXISTS purchase_details(\
        purchase_id INTEGER REFERENCES purchases(purchase_id),\
        item_id STRING REFERENCES items(item_id),\
        quantity INTEGER,\
        PRIMARY KEY(purchase_id,item_id)\
        )"

cur.execute(query4)


conn.commit()
conn.close()