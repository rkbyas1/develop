from flask import render_template,request
from models import Customer, Item, app, db
import sqlalchemy

# ページ遷移
@app.route("/")
def index():
    cus = Customer.query.all()
    return render_template("1_index.html", customers=cus)

@app.route("/item")
def item():
    items = Item.query.all()
    return render_template('2_item.html', items=items)

# 機能系
# 1-1.顧客登録
@app.route("/add_customer",methods=["POST"])
def add_customer():
    customer_id = request.form["input-customer-id"]
    # print(customer_id)
    customer_name = request.form["input-customer-name"]
    age = request.form["input-age"]
    gender = request.form["input-gender"]
    customer = Customer(customer_id, customer_name, age, gender)
    try:
        db.session.add(customer)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html")

    return render_template("1-1_confirm_added_customer.html", cus=customer)


# 1-2.性別で抽出
@app.route("/select_gender", methods=["POST"])
def select_gender():
    gender = request.form["input-gender2"]
    customers = Customer.query.filter(Customer.gender==gender).all()
    return render_template("1-2_result_select_gender.html", cus=customers)

# 2-1.商品登録
@app.route("/add_item",methods=["POST"])
def add_item():
    item_id = request.form["input-item-id"]
    item_name = request.form["input-item-name"]
    price = request.form["input-price"]
    item = Item(item_id, item_name, price)
    try:
        db.session.add(item)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html")

    return render_template("2-1_confirm_added_item.html", itm=item)

# 2-2.商品削除
@app.route("/delete_item",methods=["POST"])
def delete_item():
    item_id = request.form["input-item-id"]
    item = Item.query.filter_by(item_id=item_id).first()
    # item = Item.query.filter_by(item_id=item_id)
    # print(Item)
    # print(type(item))
    try:
        db.session.delete(item)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html")

    return render_template("2-2_confirm_deleted_item.html", itm=item)

# 2-3.商品更新
@app.route("/update_item",methods=["POST"])
def update_item():
    item_id = request.form["input-item-id"]
    updated_item_name = request.form["input-item-name"]
    updated_item_price = request.form["input-item-price"]
    item = Item.query.filter_by(item_id=item_id).first()
    try:
        item.item_name = updated_item_name
        item.price =updated_item_price
        db.session.add(item)
        db.session.commit()
    except AttributeError:
        return render_template("error.html", message="更新対象がありません。")
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html", message="一意制約エラー")

    return render_template("2-3_confirm_updated_item.html", itm=item)

# 2-4.商品名で検索
@app.route("/select_item_name",methods=["POST"])
def select_item_name():
    item_name = request.form["input-item-name"]
    # 部分一致検索
    select_target = "%{}%".format(item_name)
    items = Item.query.filter(Item.item_name.like(select_target)).all()

    return render_template("2-4_result_items.html", items=items, result_type="抽出")


# 2-5.単価で並び替え
@app.route("/sorting_item",methods=["POST"])
def sorting_item():
    order_type = request.form["order_type"]
    
    if order_type == "ascending":
        items = Item.query.order_by(Item.price)
    else:
        items = Item.query.order_by(Item.price.desc())

    return render_template("2-4_result_items.html", items=items, result_type="並び替え")


# 実行部
if __name__=="__main__":
    app.run(host="127.0.0.1", port=int("5000"),debug=True)