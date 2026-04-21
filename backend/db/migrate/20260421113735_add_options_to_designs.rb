class AddOptionsToDesigns < ActiveRecord::Migration[7.0]
  def change
    add_column :designs, :options, :jsonb
  end
end
