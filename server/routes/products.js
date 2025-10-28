import express from 'express';

const router = express.Router();

// Mock product data as fallback
const mockProducts = [
  {
    id: '1',
    name: 'Classic Wool Sweater',
    price: 299.99,
    description: 'Premium wool sweater with signature compass badge',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    category: 'Knitwear'
  },
  {
    id: '2',
    name: 'Technical Jacket',
    price: 799.99,
    description: 'Water-resistant technical jacket with multiple pockets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    category: 'Outerwear'
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 89.99,
    description: 'Essential cotton t-shirt with minimal branding',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    category: 'Basics'
  },
  {
    id: '4',
    name: 'Cargo Pants',
    price: 349.99,
    description: 'Functional cargo pants with reinforced knees',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=400&fit=crop',
    category: 'Bottoms'
  },
  {
    id: '5',
    name: 'Hooded Sweatshirt',
    price: 249.99,
    description: 'Heavyweight cotton hooded sweatshirt',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    category: 'Knitwear'
  },
  {
    id: '6',
    name: 'Nylon Overshirt',
    price: 449.99,
    description: 'Lightweight nylon overshirt with button closure',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    category: 'Shirts'
  },
  {
    id: '7',
    name: 'Knit Beanie',
    price: 119.99,
    description: 'Ribbed knit beanie with logo patch',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=300&h=400&fit=crop',
    category: 'Accessories'
  },
  {
    id: '8',
    name: 'Canvas Backpack',
    price: 399.99,
    description: 'Durable canvas backpack with leather details',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop',
    category: 'Accessories'
  },
  {
    id: '9',
    name: 'Leather Boots',
    price: 599.99,
    description: 'Premium leather boots with durable sole',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=400&fit=crop',
    category: 'Footwear'
  },
  {
    id: '10',
    name: 'Denim Jacket',
    price: 399.99,
    description: 'Classic denim jacket with vintage wash',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop',
    category: 'Outerwear'
  },
  {
    id: '11',
    name: 'Wool Scarf',
    price: 149.99,
    description: 'Soft wool scarf in neutral tones',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=400&fit=crop',
    category: 'Accessories'
  },
  {
    id: '12',
    name: 'Chino Pants',
    price: 279.99,
    description: 'Slim fit chino pants in classic khaki',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop',
    category: 'Bottoms'
  },
  {
    id: '13',
    name: 'Flannel Shirt',
    price: 189.99,
    description: 'Comfortable flannel shirt with button-down collar',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop',
    category: 'Shirts'
  },
  {
    id: '14',
    name: 'Running Sneakers',
    price: 449.99,
    description: 'Lightweight running sneakers with cushioned sole',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop',
    category: 'Footwear'
  },
  {
    id: '15',
    name: 'Leather Belt',
    price: 99.99,
    description: 'Genuine leather belt with metal buckle',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=300&h=400&fit=crop',
    category: 'Accessories'
  },
  {
    id: '16',
    name: 'Polo Shirt',
    price: 129.99,
    description: 'Classic polo shirt in premium cotton',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
    category: 'Basics'
  },
  {
    id: '17',
    name: 'Winter Coat',
    price: 899.99,
    description: 'Insulated winter coat with hood',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop',
    category: 'Outerwear'
  },
  {
    id: '18',
    name: 'Dress Shoes',
    price: 549.99,
    description: 'Elegant leather dress shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&h=400&fit=crop',
    category: 'Footwear'
  },
  {
    id: '19',
    name: 'Baseball Cap',
    price: 79.99,
    description: 'Adjustable baseball cap with embroidered logo',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=400&fit=crop',
    category: 'Accessories'
  },
  {
    id: '20',
    name: 'Jogger Pants',
    price: 199.99,
    description: 'Comfortable jogger pants with elastic waist',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300&h=400&fit=crop',
    category: 'Bottoms'
  }
];

/**
 * GET /api/products
 * Fetch products with pagination support - using mock data for consistency with cart
 * Query params: page (default: 1), limit (default: 12)
 */
router.get('/', async (req, res) => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    // Calculate pagination
    const totalProducts = mockProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice products array for current page
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);

    // Calculate hasMore flag
    const hasMore = page < totalPages;

    console.log('[GET /api/products] Returning paginated data:', {
      page,
      limit,
      totalProducts,
      totalPages,
      hasMore,
      returnedCount: paginatedProducts.length
    });

    // Return paginated response with metadata
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore,
        limit
      }
    });
  } catch (error) {
    console.error('[GET /api/products] Error:', {
      message: error.message,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
