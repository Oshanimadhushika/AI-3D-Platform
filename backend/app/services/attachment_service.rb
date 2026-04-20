require 'open-uri'

class AttachmentService
  def self.attach_remote_files(design, data)
    return unless data.present?

    # Attach GLB
    if data["glb_url"].present?
      begin
        # If it's a relative URL (which we used for dev), we might need to handle it
        # But usually we expect an absolute URL from a real AI service
        url = data["glb_url"].start_with?("http") ? data["glb_url"] : "http://localhost:3000#{data["glb_url"]}"
        file = URI.open(url)
        design.glb_model.attach(io: file, filename: "model_#{design.id}.glb", content_type: "model/gltf-binary")
      rescue => e
        Rails.logger.error "Failed to attach GLB: #{e.message}"
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
