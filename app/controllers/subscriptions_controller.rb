class SubscriptionsController < ApplicationController
  PRICE_ID = "price_1HiWOBKHNrIivYtE149qWZnN"

  def index
    customer_id = current_user.customer_id
    if customer_id.nil?
      customer = Stripe::Customer.create(
        { email: current_user.email }
      )
      current_user.update!(customer_id: customer.id)
      customer_id = customer.id

      # ***** カード情報登録に必要 *****
    @intent = Stripe::SetupIntent.create({ customer: customer_id })
    # ***** 商品情報をビューファイルで使いたい場合は以下を追加 *****
    @price = Stripe::Price.retrieve(PRICE_ID)
    @product = Stripe::Product.retrieve(@price.product)
    end
  end

  def create
    # 定期決済処理を実行
    subscription = Stripe::Subscription.create(
      {
        customer: current_user.customer_id,
        items: [
          { price: PRICE_ID }
        ],
        default_payment_method: params[:payment_method_id]
      }
    )
    # 定期支払いIDをデータベースに保存
    current_user.update!(subscription_id: subscription.id)

    # 「顧客」にデフォルトのクレジットカードとして登録
    Stripe::Customer.update(
      current_user.customer_id,
      {
        invoice_settings: {
          default_payment_method: params[:payment_method_id]
        }
      }
    )
  end

  def show
  end

end
