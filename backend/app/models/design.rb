class Design < ApplicationRecord
  belongs_to :user
  has_one_attached :source_image

  validates :prompt, presence: true
  validates :category, presence: true
end
