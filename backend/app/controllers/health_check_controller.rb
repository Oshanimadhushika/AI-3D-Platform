class HealthCheckController < ApplicationController
  def index
    render json: { status: "ok", service: "backend", time: Time.current }
  end
end
