require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot for performance.
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Ensures the cache behaves correctly.
  config.action_controller.perform_caching = true

  # Store uploaded files on Amazon S3 in production.
  config.active_storage.service = :amazon

  # Force all access to the app over SSL.
  config.force_ssl = true

  # Use a real queuing backend in production.
  # config.active_job.queue_adapter = :sidekiq

  # Use default logging formatter.
  config.log_formatter = ::Logger::Formatter.new

  # Use a different logger for distributed setups.
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new($stdout)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Inserts middleware to perform automatic connection switching.
  # config.active_record.database_selector = { delay: 2.seconds }
  # config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
  # config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session

  # Production host for generating absolute URLs (used by Active Storage).
  # Set RAILS_HOST in your environment to your actual Render/Railway domain.
  production_host = ENV.fetch("RAILS_HOST", ENV.fetch("RENDER_EXTERNAL_HOSTNAME", "your-backend.onrender.com"))
  config.action_controller.default_url_options = { host: production_host, protocol: "https" }
  routes.default_url_options = { host: production_host, protocol: "https" }

  # Enable Active Storage Proxying to solve CORS issues and 301 redirects
  config.active_storage.resolve_model_to_route = :proxy
end
