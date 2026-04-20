class CreateDesigns < ActiveRecord::Migration[7.0]
  def change
    create_table :designs do |t|
      t.references :user, null: false, foreign_key: true
      t.text :prompt
      t.string :image_url
      t.string :model_glb_url
      t.string :model_obj_url
      t.string :model_stl_url
      t.string :category

      t.timestamps
    end
  end
end
