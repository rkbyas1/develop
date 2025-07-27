import sqlite3
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

dbname = "CRM.db"
conn = sqlite3.connect(dbname)
cur = conn.cursor()

# value1 = ('C001', '佐藤A子', 64, '女')
# value2 = ('C002', '鈴木B子', 34, '女')
# value3 = ('C003', '斎藤C男', 21, '男')

valList = [
    ('C001', '佐藤A子', 64, '女'),
    ('C002', '鈴木B子', 34, '女'),
    ('C003', '斎藤C男', 21, '男') 
]

for val in valList:
    query = f"insert into customers(customer_id, customer_name, age, gender)\
        values{val}"
    cur.execute(query)

conn.commit()
conn.close()