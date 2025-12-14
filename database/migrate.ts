import { query } from './db';
import { products as initialProducts } from '../src/data/products';

export async function migrateProducts() {
  console.log('Starting product migration...');
  
  for (const product of initialProducts) {
    try {
      await query(
        `INSERT INTO products (id, name, description, price, image, category, color, featured, brand, material, rating, reviews_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = $2,
           description = $3,
           price = $4,
           image = $5,
           category = $6,
           color = $7,
           featured = $8,
           brand = $9,
           material = $10,
           rating = $11,
           reviews_count = $12`,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.image,
          product.category,
          product.color || null,
          product.featured || false,
          product.brand || null,
          product.material || null,
          product.rating || null,
          product.reviewsCount || 0
        ]
      );
      
      // Insert product images if available
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING`,
            [product.id, product.images[i], i === 0, i]
          );
        }
      }
      
      console.log(`Migrated product: ${product.name}`);
    } catch (error) {
      console.error(`Error migrating product ${product.id}:`, error);
    }
  }
  
  console.log('Product migration completed!');
}

export async function initDatabase() {
  console.log('Initializing database...');
  
  try {
    // Test connection
    await query('SELECT NOW()');
    console.log('Database connection successful!');
    
    // Run migration
    await migrateProducts();
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
