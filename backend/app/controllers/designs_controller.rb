class DesignsController < ApplicationController
  def index
    @designs = Design.all.order(created_at: :desc)
    render json: @designs.as_json(methods: [:model_glb_url, :model_obj_url, :model_stl_url])
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
    
    prompt = params.dig(:design, :prompt)
    category = params.dig(:design, :category)
    options = params.dig(:design, :options)&.to_unsafe_h || {}

    ai_client = AiServiceClient.new
    result = ai_client.text_to_3d(prompt, category, options)

    if result[:success]
      @design = user.designs.build(design_params)
      
      # Save the record first to ensure it's persisted before attaching
      if @design.save
        AttachmentService.attach_remote_files(@design, result[:data])
        render json: @design.as_json(methods: [:model_glb_url, :model_obj_url, :model_stl_url]), status: :created
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
    options = params[:options] || params.dig(:design, :options)&.to_unsafe_h || {}

    @design = user.designs.build(prompt: prompt, category: category)
    @design.source_image.attach(params[:image]) if params[:image]
    
    if @design.save
      ai_client = AiServiceClient.new
      # Pass the real public URL of the uploaded image to the AI service
      image_url = Rails.application.routes.url_helpers.url_for(@design.source_image)
      result = ai_client.image_to_3d(image_url, category, options)

      if result[:success]
        AttachmentService.attach_remote_files(@design, result[:data])
        render json: @design.as_json(methods: [:model_glb_url, :model_obj_url, :model_stl_url]), status: :created
      else
        render json: { error: result[:error], details: result[:details] }, status: :service_unavailable
      end
    else
      render json: { errors: @design.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @design = Design.find(params[:id])
    @design.destroy
    head :no_content
  end

  private

  def design_params
    params.require(:design).permit(:prompt, :category, options: {})
  end

  def map_ai_data(design, data)
    design.model_glb_url = data["glb_url"]
    design.model_obj_url = data["obj_url"]
    design.model_stl_url = data["stl_url"]
    design.image_url = "https://example.com/preview.png" # Standard preview
  end
end
