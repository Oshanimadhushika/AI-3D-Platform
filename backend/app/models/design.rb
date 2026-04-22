class Design < ApplicationRecord
  belongs_to :user
  has_one_attached :source_image
  has_one_attached :rendered_image
  has_one_attached :glb_model
  has_one_attached :obj_model
  has_one_attached :stl_model

  def model_glb_url
    glb_model.attached? ? Rails.application.routes.url_helpers.url_for(glb_model) : nil
  end

  def model_obj_url
    obj_model.attached? ? Rails.application.routes.url_helpers.url_for(obj_model) : nil
  end

  def model_stl_url
    stl_model.attached? ? Rails.application.routes.url_helpers.url_for(stl_model) : nil
  end

  def source_image_url
    source_image.attached? ? Rails.application.routes.url_helpers.url_for(source_image) : nil
  end

  def rendered_image_url
    rendered_image.attached? ? Rails.application.routes.url_helpers.url_for(rendered_image) : nil
  end

  validates :prompt, presence: true
  validates :category, presence: true
end
