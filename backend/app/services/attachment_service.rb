require 'open-uri'

class AttachmentService
  def self.attach_remote_files(design, data)
    return unless data.present?

    # Attach GLB
    if data["glb_url"].present?
      begin
        url = data["glb_url"].start_with?("http") ? data["glb_url"] : "http://localhost:3000#{data["glb_url"]}"
        # Setting a small open_timeout to avoid hanging
        file = URI.open(url, open_timeout: 5)
        attachment = design.glb_model.attach(io: file, filename: "model_#{design.id || SecureRandom.hex(4)}.glb", content_type: "model/gltf-binary")
        
        unless design.glb_model.attached?
          Rails.logger.error "GLB Attachment failed to save: #{design.errors.full_messages}"
        end
      rescue OpenURI::HTTPError => e
        Rails.logger.error "Tripo GLB HTTP Error: #{e.message} for URL: #{url}"
      rescue => e
        Rails.logger.error "Failed to attach GLB: #{e.message} (#{e.class})"
      end
    end

    # Attach OBJ
    if data["obj_url"].present? && data["obj_url"].start_with?("http")
      begin
        file = URI.open(data["obj_url"])
        design.obj_model.attach(io: file, filename: "model_#{design.id}.obj", content_type: "text/plain")
      rescue => e
        Rails.logger.error "Failed to attach OBJ: #{e.message}"
      end
    end

    # Attach STL
    if data["stl_url"].present? && data["stl_url"].start_with?("http")
      begin
        file = URI.open(data["stl_url"])
        design.stl_model.attach(io: file, filename: "model_#{design.id}.stl", content_type: "application/vnd.ms-pki.stl")
      rescue => e
        Rails.logger.error "Failed to attach STL: #{e.message}"
      end
    end
  end
end
