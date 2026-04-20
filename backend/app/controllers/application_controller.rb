class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def handle_standard_error(error)
    Rails.logger.error "Unhandled Exception: #{error.message}\n#{error.backtrace.first(10).join("\n")}"
    render json: { error: "Internal Server Error", detail: error.message }, status: :internal_server_error
  end

  def record_not_found(error)
    render json: { error: error.message }, status: :not_found
  end
end
