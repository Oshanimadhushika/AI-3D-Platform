# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_04_21_113735) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "aal_level", ["aal1", "aal2", "aal3"]
  create_enum "action", ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"]
  create_enum "buckettype", ["STANDARD", "ANALYTICS", "VECTOR"]
  create_enum "code_challenge_method", ["s256", "plain"]
  create_enum "equality_op", ["eq", "neq", "lt", "lte", "gt", "gte", "in"]
  create_enum "factor_status", ["unverified", "verified"]
  create_enum "factor_type", ["totp", "webauthn", "phone"]
  create_enum "oauth_authorization_status", ["pending", "approved", "denied", "expired"]
  create_enum "oauth_client_type", ["public", "confidential"]
  create_enum "oauth_registration_type", ["dynamic", "manual"]
  create_enum "oauth_response_type", ["code"]
  create_enum "one_time_token_type", ["confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token"]

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "designs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "prompt"
    t.string "image_url"
    t.string "model_glb_url"
    t.string "model_obj_url"
    t.string "model_stl_url"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "options"
    t.index ["user_id"], name: "index_designs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "designs", "users"
end
