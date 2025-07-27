# import datetime
from flask import render_template,request
from models import Customer, Item, app, db, Purchase,Purchase_detail
import sqlalchemy
from sqlalchemy import func
from datetime import datetime
from bs4 import BeautifulSoup as Soup

# ページ遷移
# １，トップページ＆顧客登録ページ
@app.route("/")
def index():
    cus = Customer.query.all()
    return render_template("1_index.html", customers=cus)

# ２，商品管理ページ
@app.route("/item")
def item():
    items = Item.query.all()
    return render_template('2_item.html', items=items)

# ３，購入情報登録ページ
@app.route("/purchase")
def purchase():
    customers = Customer.query.all()
    items = Item.query.all()
    return render_template(
        '3_purchase.html', 
        customers=customers, 
        items=items,
        today=datetime.today()
        )

# 4，購入情報検索/分析ページ
@app.route("/purchase_data_statistics")
def purchase_data_statistics():
    joined_purchase_details = db.session.query(Purchase,Purchase_detail).join(Purchase_detail,Purchase.purchase_id==Purchase_detail.purchase_id).all()
    joined_purchase_details = db.session.query(Purchase,Purchase_detail,Customer).join(Purchase_detail,Purchase.purchase_id==Purchase_detail.purchase_id).join(Customer,Purchase.customer_id==Customer.customer_id).all()
    joined_purchase_details = db.session.query(Purchase,Purchase_detail,Customer,Item).join(Purchase_detail,Purchase.purchase_id==Purchase_detail.purchase_id).join(Customer,Purchase.customer_id==Customer.customer_id).join(Item,Purchase_detail.item_id==Item.item_id).all()
    customers = Customer.query.all()
    return render_template("4_purchase_data_statistics.html",joined_purchase_details=joined_purchase_details,customers=customers)

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


# 1-2.抽出
@app.route("/select_gender", methods=["POST"])
def select_gender():
    cus = Customer.query.all()
    gender = request.form["input-gender2"] #性別
    id = request.form["input-id"] #ID
    name = request.form["input-name"] 
    like_name = "%{}%".format(name) #名前部分一致
    age1 = request.form["input-age1"] #年齢範囲1
    age2 = request.form["input-age2"] #年齢範囲2

    conditions = []

    # 性別
    if not gender:
        pass
    else:
        conditions.append(Customer.gender==gender)
    # ID
    if not id:
        pass
    else:
        conditions.append(Customer.customer_id==id)
    # 氏名
    if not name:
        pass
    else:
        conditions.append(Customer.customer_name.like(like_name))
    # 年齢from
    if not age1 :
        pass
    else:
        conditions.append(Customer.age >= age1)
    # 年齢to
    if not age2:
        pass
    else:
        conditions.append(Customer.age <= age2)

    size = len(conditions)
    conditions_list = []

    # 条件があれば配列に格納、なければ入れない
    for i in range(size):
        conditions_list.append(conditions[i]+',')

    # 条件を入れた配列を展開してfilterに適用
    customers = Customer.query.filter(*conditions_list).all()

    # soup1 = Soup(open("1-2_result_select_gender.html"), 'html.parser')
    # soup2 = Soup(open("1_index.html"), 'html.parser')

    # soup2.append
    # return render_template("1-2_result_select_gender.html", cus=customers)
    return render_template("1_index.html", customers=cus, cusRes=customers)


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

# 3-1.購入情報登録
@app.route("/add_purchase",methods=["POST"])
def add_purchase():
    customer_name = request.form['input-customer-name']
    item_name1 = request.form["input-item-name1"]
    quantity1 = request.form["input-quantity1"]
    item_name2 = request.form["input-item-name2"]
    quantity2 = request.form["input-quantity2"]
    date = request.form["input-date"]
    date = datetime.strptime(date, "%Y-%m-%d")
    customer = Customer.query.filter_by(customer_name=customer_name).first()
    purchase = Purchase(customer.customer_id, date)

    try:
        db.session.add(purchase)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html", message="一意制約エラー")
    
    item1 = Item.query.filter_by(item_name=item_name1).first()
    purchase_detail = Purchase_detail(purchase.purchase_id, item1.item_id, quantity1)

    try:
        db.session.add(purchase_detail)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html", message="一意制約エラー")


    if item_name2:
        item2 = Item.query.filter_by(item_name=item_name2).first()
        purchase_detail = Purchase_detail(purchase.purchase_id, item2.item_id, quantity2)

        try:
            db.session.add(purchase_detail)
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            return render_template("error.html", message="一意制約エラー")
    
    return render_template("3-1_confirm_purchase.html", purchase=purchase)

# 3-2.購入情報削除
@app.route("/delete_purchase",methods=["POST"])
def delete_purchase():
    purchase_id = request.form["input-purchase-id"]
    purchase = Purchase.query.filter_by(purchase_id=purchase_id).first()
    try:
        db.session.delete(purchase)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return render_template("error.html")

    return render_template("3-2_confirm_deleted_purchase.html", purchase=purchase)

# 4-1.購入情報検索
@app.route("/search_purchase",methods=["POST"])
def search_purchase():
    item_name = request.form["input-item-name"]
    customer_name = request.form["input-customer-name"]
    date = request.form["input-date"]

    # item_nameに入力がある場合、部分一致検索してヒットしたもののitem_idをitem_id_listに保持する
    if item_name:
        search_target = "%{}%".format(item_name)
        items = Item.query.filter(Item.item_name.like(search_target)).all()
        # item_id_list = []
        # for item in items:
        #     item_id_list.append(item.item_id)
        item_id_list = [item.item_id for item in items]
        
    # customer_nameは一致する一件のみを取得する
    if customer_name:
        customer = Customer.query.filter_by(customer_name=customer_name).first()
        customer_id = customer.customer_id
    else:
        customer = None
    # dateはdate型にデータ変換を行う
    if date:
        date = datetime.strptime(date, "%Y-%m-%d")

    # 前段で取得したcustomer_idとdateのデータで購入情報を検索する
    is_cus_date = True
    if customer and date:
        purchases = Purchase.query.filter(Purchase.customer_id==customer_id,Purchase.date==date).all()
    elif customer:
        purchases = Purchase.query.filter(Purchase.customer_id==customer_id).all()
    elif date:
        purchases = Purchase.query.filter(Purchase.date==date).all()
    else:
        is_cus_date = False
    
    # 購入情報が一件以上ヒットした場合、その情報をリストに保持する
    if is_cus_date:
        # purchase_id_list = []
        # for purchase in purchases:
        #     purchase_id_list.append(purchase.purchase_id)
        ## 以下、内包表記
        purchase_id_list = [purchase.purchase_id for purchase in purchases]
    
    # 検索取得した購入情報をitem_idでさらに絞り込みをかけ、検索結果画面として表示する
    if is_cus_date and item_name:
        purchase_details = Purchase_detail.query.filter(Purchase_detail.item_id.in_(item_id_list), Purchase_detail.purchase_id.in_(purchase_id_list)).all()
        return render_template("4-1_result_search_purchase.html", purchase_details=purchase_details)
    elif is_cus_date:
        purchase_details = Purchase_detail.query.filter(Purchase_detail.purchase_id.in_(purchase_id_list)).all()
        return render_template("4-1_result_search_purchase.html", purchase_details=purchase_details)
    elif item_name:
        purchase_details = Purchase_detail.query.filter(Purchase_detail.item_id.in_(item_id_list)).all()
        return render_template("4-1_result_search_purchase.html", purchase_details=purchase_details)
    else:
        # 検索項目を入力しなかった場合のエラー
        return render_template("error.html", message="検索条件を指定してください")

# 統計情報算出
@app.route("/count_customers",methods=["POST"])
def count_customers():
    statistics_type = "総顧客数"
    # Customerテーブルのレコード数をカウントする
    customer_numbers = db.session.query(Customer).count()
    result = str(customer_numbers)+"人"

    return render_template("4-2.result_statistics.html",statistics_type=statistics_type, result=result)

# 総販売商品数
@app.route("/count_quantity",methods=["POST"])
def count_quantity():
    statistics_type = "総販売商品数量"
    # Purchase_detailテーブルのquantityをsumした結果を配列で取得し、その一データ目をtotal_quantityとする
    total_quantity = db.session.query(func.sum(Purchase_detail.quantity)).first()
    print(total_quantity)
    for row in total_quantity:
        print(row)
        result = row
    result = str(int(result))+"個"

    return render_template("4-2.result_statistics.html",statistics_type=statistics_type, result=result)


# 総売上
@app.route("/total_sales",methods=["POST"])
def total_sales():
    statistics_type = "総売上"
    joined_table = db.session.query(Purchase_detail.purchase_id, Purchase_detail.quantity, Item.price, Item.item_id).join(Item,Purchase_detail.item_id==Item.item_id).all()
    total_sales = 0
    for row in joined_table:
        if row.quantity:
            sale = row.price * row.quantity
            total_sales += sale
    result = str(total_sales) + "円"
    return render_template("4-2.result_statistics.html",statistics_type=statistics_type, result=result)

# 販売数ランキング
@app.route("/ranking_items",methods=["POST"])
def ranking_items():
    statistics_type = "販売数ランキング"
    purchase_details = Purchase_detail.query.all()
    item_count_dict = {}
    #{item_id_A:総数量}
    #{item_id_B:総数量}
    for purchase_detail in purchase_details:
        item_id = purchase_detail.item_id
        quantity = purchase_detail.quantity
        if quantity:
            if item_count_dict.get(item_id) is None:
                item_count_dict[item_id] = quantity
            else:
                item_count_dict[item_id] = item_count_dict[item_id] + quantity
        
    item_count_dict = sorted(item_count_dict.items(),key=lambda x:x[1],reverse=True)
    items = []
    for index,item_tuple in enumerate(item_count_dict):
        item = list(item_tuple)
        item_name = Item.query.filter_by(item_id=item[0]).first().item_name
        item.append(item_name)
        item.append(str(index+1)+"位")
        items.append(item)
    
    return render_template("4-3.result_ranking.html",statistics_type=statistics_type, items=items)


# 実行部
if __name__=="__main__":
    app.run(host="127.0.0.1", port=int("5000"),debug=True)