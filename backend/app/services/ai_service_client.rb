require 'faraday'

class AiServiceClient
  BASE_URL = 'http://localhost:8000'

  def initialize
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.request :json
      f.response :json
      f.options.timeout = 180 # 180 seconds (3 mins) for real Tripo AI generation
      f.options.open_timeout = 5
      f.adapter Faraday.default_adapter
    end
  end

  def text_to_3d(prompt, category = "Uncategorized")
    response = @conn.post('/text-to-3d', { prompt: prompt, category: category })
    handle_response(response)
  rescue Faraday::Error => e
    handle_error(e)
  end

  def image_to_3d(image_url, category = "ImageDriven")
    # For now, FastAPI expects a JSON body with image_url
    response = @conn.post('/image-to-3d', { image_url: image_url, category: category })
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
