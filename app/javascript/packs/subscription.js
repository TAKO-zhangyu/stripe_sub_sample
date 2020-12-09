import {getCardElement, confirmCardSetup, createSubscription} from './stripe'

document.addEventListener("turbolinks:load", () => {
    const cardElement = getCardElement()
    const cardErrors = document.getElementById('card-errors')
    const subscriptionButton = document.getElementById('subscription-button')

    subscriptionButton.disabled = true
    // カード情報フォームを生成
    cardElement.mount('#card-element')
    // カード情報入力不備のエラー表示
    cardElement.on('change', e => {
        if (e.error) {
            cardErrors.textContent = e.error.message
            subscriptionButton.disabled = true
        } else {
            cardErrors.textContent = ''
            subscriptionButton.disabled = false
        }
    })
    
    const form = document.getElementById('subscription-form')
    form.addEventListener('submit', e => {
        e.preventDefault()
        subscriptionButton.disabled = true
        subscriptionButton.textContent = '送信中……'
        confirmCardSetup(cardElement, form.dataset.secret)
            .then(result => {
                if (result.setupIntent) {
                    if (result.setupIntent.status === 'succeeded') {
                        createSubscription(result.setupIntent.payment_method)
                    }
                } else if (result.error) {
                    cardErrors.textContent = result.error.message
                    subscriptionButton.textContent = 'サービスに申し込む'
                }
            })
    })
})
