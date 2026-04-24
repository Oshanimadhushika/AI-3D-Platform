class Design < ApplicationRecord
  belongs_to :user
  has_one_attached :source_image
  has_one_attached :rendered_image
  has_one_attached :glb_model
  has_one_attached :obj_model
  has_one_attached :stl_model

  def model_glb_url
    glb_model.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(glb_model, only_path: false) : nil
  end

  def model_obj_url
    obj_model.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(obj_model, only_path: false) : nil
  end

  def model_stl_url
    stl_model.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(stl_model, only_path: false) : nil
  end

  def source_image_url
    source_image.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(source_image, only_path: false) : nil
  end

  def rendered_image_url
    rendered_image.attached? ? Rails.application.routes.url_helpers.rails_storage_proxy_url(rendered_image, only_path: false) : nil
  end

  validates :prompt, presence: true
  validates :category, presence: true
end
