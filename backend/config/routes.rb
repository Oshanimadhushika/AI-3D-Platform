Rails.application.routes.draw do
  get "health", to: "health_check#index"

  post "/generate-from-text", to: "designs#generate_from_text"
  post "/generate-from-image", to: "designs#generate_from_image"

  resources :designs, only: [:index, :show, :destroy]
end
