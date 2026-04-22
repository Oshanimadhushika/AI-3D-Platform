require 'faraday'

class AiServiceClient
  BASE_URL = ENV.fetch('AI_SERVICE_URL', 'http://localhost:8000')

  def initialize
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.request :json
      f.response :json
      f.options.timeout = 300 # 300 seconds (5 mins) for increased complexity
      f.options.open_timeout = 10
      f.adapter Faraday.default_adapter
    end
  end

  def text_to_3d(prompt, category = "Uncategorized", options = {})
    payload = { prompt: prompt, category: category, options: options }
    
    Rails.logger.info("\n[RAILS] Outgoing AI Request (Text-to-3D):")
    Rails.logger.info("  URL: #{BASE_URL}/text-to-3d")
    Rails.logger.info("  Payload: #{payload.to_json}")

    response = @conn.post('/text-to-3d', payload)
    handle_response(response)
  rescue Faraday::Error => e
    handle_error(e)
  end

  def image_to_3d(image_url, prompt = nil, category = "ImageDriven", options = {})
    payload = { image_url: image_url, prompt: prompt, category: category, options: options }

    Rails.logger.info("\n[RAILS] Outgoing AI Request (Image-to-3D):")
    Rails.logger.info("  URL: #{BASE_URL}/image-to-3d")
    Rails.logger.info("  Payload: #{payload.to_json}")

    response = @conn.post('/image-to-3d', payload)
    handle_response(response)
  rescue Faraday::Error => e
    handle_error(e)
  end

  private

  def handle_response(response)
    if response.success?
      { success: true, data: response.body }
    else
      { success: false, error: "AI Service Error: #{response.status}", details: response.body }
    end
  end

  def handle_error(exception)
    Rails.logger.error("AI Service Connection Failure: #{exception.message}")
    { success: false, error: "AI Service is unreachable", details: exception.message }
  end
end
