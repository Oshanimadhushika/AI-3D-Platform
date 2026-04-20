class DesignsController < ApplicationController
  def index
    @designs = Design.all
    render json: @designs
  end

  def show
    @design = Design.find(params[:id])
    # Include the source image URL if attached
    response_data = @design.as_json
    response_data[:source_image_url] = url_for(@design.source_image) if @design.source_image.attached?
    
    render json: response_data
  end

  def generate_from_text
    # For now, associate with a default user for testing
    user = User.first || User.create!(email: "guest@example.com", password: "password")
    
    ai_client = AiServiceClient.new
    result = ai_client.text_to_3d(params.dig(:design, :prompt), params.dig(:design, :category))

    if result[:success]
      @design = user.designs.build(design_params)
      map_ai_data(@design, result[:data])

      if @design.save
        render json: @design, status: :created
      else
        render json: { errors: @design.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: result[:error], details: result[:details] }, status: :service_unavailable
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: "Missing parameters: #{e.param}" }, status: :bad_request
  end

  def generate_from_image
    user = User.first || User.create!(email: "guest@example.com", password: "password")
    
    prompt = params[:prompt] || params.dig(:design, :prompt)
    category = params[:category] || params.dig(:design, :category) || "Uncategorized"

    # For image-to-3d, we first save the attachment, then we would typically send it to AI
    # For now, we simulate the flow
    @design = user.designs.build(prompt: prompt, category: category)
    @design.source_image.attach(params[:image]) if params[:image]
    
    # Simulate sending to AI (passing the image URL if public, or just prompt)
    ai_client = AiServiceClient.new
    result = ai_client.image_to_3d("http://example.com/source_image.png", category)

    if result[:success]
      map_ai_data(@design, result[:data])
      if @design.save
        render json: @design, status: :created
      else
        render json: { errors: @design.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: result[:error], details: result[:details] }, status: :service_unavailable
    end
  end

  def destroy
    @design = Design.find(params[:id])
    @design.destroy
    head :no_content
  end

  private

  def design_params
    params.require(:design).permit(:prompt, :category)
  end

  def map_ai_data(design, data)
    design.model_glb_url = data["glb_url"]
    design.model_obj_url = data["obj_url"]
    design.model_stl_url = data["stl_url"]
    design.image_url = "https://example.com/preview.png" # Standard preview
  end
end
