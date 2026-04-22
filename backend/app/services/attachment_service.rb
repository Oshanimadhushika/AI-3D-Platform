require 'open-uri'

class AttachmentService
  def self.attach_remote_files(design, data)
    return unless data.present?

    Rails.logger.info "[ATTACHMENT] Data received for Design ##{design.id}: #{data.keys}"
    
    # Attach GLB
    if data["glb_url"].present?
      url = data["glb_url"].start_with?("http") ? data["glb_url"] : "http://localhost:3000#{data["glb_url"]}"
      Rails.logger.info "[ATTACHMENT] Attempting GLB attach: #{url}"
      
      begin
        # Setting a slightly larger timeout for large 3D files
        file = URI.open(url, open_timeout: 10, read_timeout: 60)
        design.glb_model.attach(io: file, filename: "model_#{design.id || SecureRandom.hex(4)}.glb", content_type: "model/gltf-binary")
        
        if design.glb_model.attached?
          Rails.logger.info "[ATTACHMENT] GLB attached successfully"
        else
          Rails.logger.error "[ATTACHMENT] GLB save failed: #{design.errors.full_messages}"
        end
      rescue => e
        Rails.logger.error "[ATTACHMENT] GLB Error: #{e.message} (#{e.class})"
      end
    else
      Rails.logger.warn "[ATTACHMENT] No glb_url present in data"
    end

    # Attach OBJ
    if data["obj_url"].present? && data["obj_url"].start_with?("http")
      Rails.logger.info "[ATTACHMENT] Attempting OBJ attach: #{data["obj_url"]}"
      begin
        file = URI.open(data["obj_url"])
        design.obj_model.attach(io: file, filename: "model_#{design.id}.obj", content_type: "text/plain")
      rescue => e
        Rails.logger.error "[ATTACHMENT] OBJ Error: #{e.message}"
      end
    end

    # Attach STL
    if data["stl_url"].present? && data["stl_url"].start_with?("http")
      Rails.logger.info "[ATTACHMENT] Attempting STL attach: #{data["stl_url"]}"
      begin
        file = URI.open(data["stl_url"])
        design.stl_model.attach(io: file, filename: "model_#{design.id}.stl", content_type: "application/vnd.ms-pki.stl")
      rescue => e
        Rails.logger.error "[ATTACHMENT] STL Error: #{e.message}"
      end
    end
  end

end
