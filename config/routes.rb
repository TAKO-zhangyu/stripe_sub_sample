Rails.application.routes.draw do
  devise_for :users
  root "subscriptions#index"
  resources :subscriptions
end
