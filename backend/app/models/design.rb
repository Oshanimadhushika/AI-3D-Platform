class Design < ApplicationRecord
  belongs_to :user
  has_one_attached :source_image
  has_one_attached :rendered_image
  has_one_attached :glb_model
  has_one_attached :obj_model
  has_one_attached :stl_model

  def model_glb_url
    if glb_model.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(glb_model, only_path: false)
    else
      # Fallback to the direct URL saved in the database column
      read_attribute(:model_glb_url)
    end
  end

  def model_obj_url
    if obj_model.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(obj_model, only_path: false)
    else
      read_attribute(:model_obj_url)
    end
  end

  def model_stl_url
    if stl_model.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(stl_model, only_path: false)
    else
      read_attribute(:model_stl_url)
    end
  end

  def source_image_url
    if source_image.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(source_image, only_path: false)
    else
      read_attribute(:image_url)
    end
  end

  def rendered_image_url
    if rendered_image.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(rendered_image, only_path: false)
    else
      # We use the 'image_url' column as the fallback for the rendered preview
      read_attribute(:image_url)
    end
  end

  validates :prompt, presence: true
  validates :category, presence: true
end
