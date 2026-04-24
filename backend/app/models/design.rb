class Design < ApplicationRecord
  belongs_to :user
  has_one_attached :source_image
  has_one_attached :rendered_image
  has_one_attached :glb_model
  has_one_attached :obj_model
  has_one_attached :stl_model

  def model_glb_url
    read_attribute(:model_glb_url)
  end

  def model_obj_url
    read_attribute(:model_obj_url)
  end

  def model_stl_url
    read_attribute(:model_stl_url)
  end

  def source_image_url
    # For source image, we still use Active Storage if it's an upload
    source_image.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(source_image, only_path: false) : read_attribute(:image_url)
  end

  def rendered_image_url
    read_attribute(:image_url)
  end

  validates :prompt, presence: true
  validates :category, presence: true
end
