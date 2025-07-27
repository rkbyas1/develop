from sqlalchemy import Table,Column,Integer,String,MetaData,create_engine,ForeignKey,DateTime
import os

main_path = os.path.dirname(os.path.abspath(__file__))
os.chdir(main_path)

engine = create_engine("sqlite:///CRM.db",echo=True)
meta = MetaData() #sqlalchemy2.0用の記述です。sqlalchemy1.6ではengineを引数に入れる必要があります
# meta = MetaData(engine) #sqlalchemy1.6用の記述です。engineを引数に入れる必要があります。
customers = Table(
        "customers",
        meta,
        Column("customer_id",String,primary_key=True),
        Column("customer_name",String),
        Column("age",Integer),
        Column("gender",String),
)

items = Table(
        "items",
        meta,
        Column("item_id",String,primary_key=True),
        Column("item_name",String),
        Column("price",Integer),
)

purchases = Table(
        "purchases",
        meta,
        Column("purchase_id",Integer,primary_key=True,autoincrement=True),
        Column("item_id",String,ForeignKey("customers.customer_id")),
        Column("date",DateTime),
)

purchase_details = Table(
        "purchases_details",
        meta,
        Column("purchase_id",Integer,ForeignKey("purchases.purchase_id"),primary_key=True),
        Column("item_id",String,ForeignKey("items.item_id"),primary_key=True),
        Column("quantity",Integer),
)
