const stripe = new Stripe(process.env.STRIPE_PUBLISHABLE_KEY)

// カード情報記載フォームを生成する関数
const getCardElement = () => {
    const elements = stripe.elements()
    // カード情報記載フォームのスタイル（CSSにもフォームのスタイルを記載）
    const cardElementStyle = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
    return elements.create('card', {style: cardElementStyle, hidePostalCode: true})
}

const confirmCardSetup = (card, clientSecret) => {
    const cardholderName = document.getElementById('cardholder-name')
    const paymentMethod = {
        payment_method: {
            card: card,
            billing_details: {
                name: cardholderName.value,
            },
        },
    }
    return stripe.confirmCardSetup(clientSecret, paymentMethod)
}

const createSubscription = (payment_method_id) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content
    // リクエスト先を指定
    fetch("/subscriptions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
            payment_method_id
        })
    })
        .then(result => {
            if (result.ok) {
                alert('支払い手続きが完了しました!')
                // リダイレクト先を指定
                // window.location.href = './payments/success'
            } else {
                alert('致命的なエラーが発生しました')
            }
        })
        .catch(error => {
            alert('致命的なエラーが発生しました')
        })
}

export {getCardElement, confirmCardSetup, createSubscription}