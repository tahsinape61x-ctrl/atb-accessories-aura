import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_SLIDERS,
  INITIAL_SETTINGS,
} from '../mockData';
import { Category, Subcategory, Brand, Product, Slider, StoreSettings, Order } from '../supabase/types';

let localCategories = [...INITIAL_CATEGORIES];
let localSubcategories = [...INITIAL_SUBCATEGORIES];
let localBrands = [...INITIAL_BRANDS];
let localProducts = [...INITIAL_PRODUCTS];
let localSliders = [...INITIAL_SLIDERS];
let localSettings = { ...INITIAL_SETTINGS };
let localOrders: Order[] = [];

export const dataService = {
  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase getCategories error:', err);
      }
    }
    return localCategories;
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured() && supabase) {
      if (category.id) {
        const { data, error } = await supabase
          .from('categories')
          .update(category)
          .eq('id', category.id)
          .select()
          .single();
        if (!error && data) return data;
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert(category)
          .select()
          .single();
        if (!error && data) return data;
      }
    }

    if (category.id) {
      localCategories = localCategories.map((c) =>
        c.id === category.id ? ({ ...c, ...category } as Category) : c
      );
      return localCategories.find((c) => c.id === category.id)!;
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: category.name || 'New Category',
        slug: category.slug || `category-${Date.now()}`,
        description: category.description || '',
        image_url: category.image_url || '',
        display_order: category.display_order || localCategories.length + 1,
        created_at: new Date().toISOString(),
      };
      localCategories.push(newCat);
      return newCat;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return true;
    }
    localCategories = localCategories.filter((c) => c.id !== id);
    return true;
  },

  // --- SUBCATEGORIES ---
  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('subcategories').select('*');
        if (categoryId) query = query.eq('category_id', categoryId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase getSubcategories error:', err);
      }
    }
    return categoryId
      ? localSubcategories.filter((s) => s.category_id === categoryId)
      : localSubcategories;
  },

  async saveSubcategory(sub: Partial<Subcategory>): Promise<Subcategory> {
    if (isSupabaseConfigured() && supabase) {
      if (sub.id) {
        const { data, error } = await supabase.from('subcategories').update(sub).eq('id', sub.id).select().single();
        if (!error && data) return data;
      } else {
        const { data, error } = await supabase.from('subcategories').insert(sub).select().single();
        if (!error && data) return data;
      }
    }

    if (sub.id) {
      localSubcategories = localSubcategories.map((s) => s.id === sub.id ? ({ ...s, ...sub } as Subcategory) : s);
      return localSubcategories.find((s) => s.id === sub.id)!;
    } else {
      const newSub: Subcategory = {
        id: `sub-${Date.now()}`,
        category_id: sub.category_id || '',
        name: sub.name || 'New Subcategory',
        slug: sub.slug || `sub-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      localSubcategories.push(newSub);
      return newSub;
    }
  },

  async deleteSubcategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('subcategories').delete().eq('id', id);
      if (!error) return true;
    }
    localSubcategories = localSubcategories.filter((s) => s.id !== id);
    return true;
  },

  // --- BRANDS ---
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('brands').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase getBrands error:', err);
      }
    }
    return localBrands;
  },

  async saveBrand(brand: Partial<Brand>): Promise<Brand> {
    if (isSupabaseConfigured() && supabase) {
      if (brand.id) {
        const { data, error } = await supabase.from('brands').update(brand).eq('id', brand.id).select().single();
        if (!error && data) return data;
      } else {
        const { data, error } = await supabase.from('brands').insert(brand).select().single();
        if (!error && data) return data;
      }
    }

    if (brand.id) {
      localBrands = localBrands.map((b) => b.id === brand.id ? ({ ...b, ...brand } as Brand) : b);
      return localBrands.find((b) => b.id === brand.id)!;
    } else {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: brand.name || 'New Brand',
        slug: brand.slug || `brand-${Date.now()}`,
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        created_at: new Date().toISOString(),
      };
      localBrands.push(newBrand);
      return newBrand;
    }
  },

  async deleteBrand(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (!error) return true;
    }
    localBrands = localBrands.filter((b) => b.id !== id);
    return true;
  },

  // --- SLIDERS ---
  async getSliders(): Promise<Slider[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('sliders')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase getSliders error:', err);
      }
    }
    return localSliders;
  },

  // --- PRODUCTS ---
  async getProducts(options?: {
    featuredOnly?: boolean;
    newArrivalsOnly?: boolean;
    categorySlug?: string;
    brandSlug?: string;
    includeInactive?: boolean;
    limit?: number;
  }): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*');
        if (!options?.includeInactive) query = query.eq('is_active', true);
        if (options?.featuredOnly) query = query.eq('is_featured', true);
        if (options?.newArrivalsOnly) query = query.eq('is_new_arrival', true);
        if (options?.limit) query = query.limit(options.limit);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          // If categorySlug filter is specified
          if (options?.categorySlug) {
            const categories = await this.getCategories();
            const cat = categories.find((c) => c.slug === options.categorySlug);
            if (cat) {
              return data.filter((p) => p.category_id === cat.id);
            }
          }
          return data;
        }
      } catch (err) {
        console.error('Supabase getProducts error:', err);
      }
    }

    let result = [...localProducts];
    if (!options?.includeInactive) result = result.filter((p) => p.is_active);
    if (options?.featuredOnly) result = result.filter((p) => p.is_featured);
    if (options?.newArrivalsOnly) result = result.filter((p) => p.is_new_arrival);
    if (options?.categorySlug) {
      const category = localCategories.find((c) => c.slug === options.categorySlug);
      if (category) result = result.filter((p) => p.category_id === category.id);
    }
    if (options?.brandSlug) {
      const brand = localBrands.find((b) => b.slug === options.brandSlug);
      if (brand) result = result.filter((p) => p.brand_id === brand.id);
    }
    if (options?.limit) result = result.slice(0, options.limit);

    return result.map((p) => {
      const category = localCategories.find((c) => c.id === p.category_id);
      const subcategory = localSubcategories.find((s) => s.id === p.subcategory_id);
      const brand = localBrands.find((b) => b.id === p.brand_id);
      return { ...p, category, subcategory, brand };
    });
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getProductById error:', err);
      }
    }
    const found = localProducts.find((p) => p.id === id);
    if (!found) return null;
    const category = localCategories.find((c) => c.id === found.category_id);
    const subcategory = localSubcategories.find((s) => s.id === found.subcategory_id);
    const brand = localBrands.find((b) => b.id === found.brand_id);
    return { ...found, category, subcategory, brand };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getProductBySlug error:', err);
      }
    }
    const found = localProducts.find((p) => p.slug === slug);
    if (!found) return null;
    const category = localCategories.find((c) => c.id === found.category_id);
    const subcategory = localSubcategories.find((s) => s.id === found.subcategory_id);
    const brand = localBrands.find((b) => b.id === found.brand_id);
    return { ...found, category, subcategory, brand };
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    if (isSupabaseConfigured() && supabase) {
      if (product.id) {
        const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
        if (!error && data) return data;
      } else {
        const { data, error } = await supabase.from('products').insert(product).select().single();
        if (!error && data) return data;
      }
    }

    if (product.id) {
      localProducts = localProducts.map((p) => p.id === product.id ? ({ ...p, ...product } as Product) : p);
      return localProducts.find((p) => p.id === product.id)!;
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: product.title || 'New Product',
        slug: product.slug || `product-${Date.now()}`,
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        brand_id: product.brand_id || '',
        price: product.price || 0,
        discount_price: product.discount_price,
        stock_quantity: product.stock_quantity || 0,
        sku: product.sku || `SKU-${Date.now()}`,
        model_no: product.model_no || '',
        description: product.description || '',
        images: product.images && product.images.length > 0 ? product.images : [
          'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
        ],
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_new_arrival: product.is_new_arrival ?? false,
        created_at: new Date().toISOString(),
      };
      localProducts.unshift(newProd);
      return newProd;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    }
    localProducts = localProducts.filter((p) => p.id !== id);
    return true;
  },

  // --- ORDERS ---
  async createOrder(orderData: any): Promise<Order> {
    const orderNumber = `ATB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      shipping_address: orderData.shipping_address,
      shipping_area: orderData.shipping_area,
      delivery_charge: orderData.delivery_charge,
      subtotal: orderData.subtotal,
      total_amount: orderData.total_amount,
      status: orderData.payment_method === 'cod' ? 'new' : 'payment_pending',
      payment_method: orderData.payment_method,
      created_at: new Date().toISOString(),
      items: orderData.items,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('orders').insert({
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          customer_email: newOrder.customer_email,
          shipping_address: newOrder.shipping_address,
          shipping_area: newOrder.shipping_area,
          delivery_charge: newOrder.delivery_charge,
          subtotal: newOrder.subtotal,
          total_amount: newOrder.total_amount,
          status: newOrder.status,
          payment_method: newOrder.payment_method,
        }).select().single();

        if (!error && data) {
          if (orderData.items && orderData.items.length > 0) {
            const itemsToInsert = orderData.items.map((it: any) => ({
              order_id: data.id,
              product_id: it.product_id,
              product_title: it.product_title,
              price: it.price,
              quantity: it.quantity,
              total: it.total,
            }));
            await supabase.from('order_items').insert(itemsToInsert);
          }

          if (orderData.payment_method !== 'cod' && orderData.trx_id) {
            await supabase.from('payments').insert({
              order_id: data.id,
              payment_method: orderData.payment_method,
              sender_number: orderData.sender_number,
              trx_id: orderData.trx_id,
              amount: newOrder.total_amount,
              status: 'pending',
            });
          }
          return { ...newOrder, id: data.id };
        }
      } catch (err) {
        console.error('Supabase createOrder error:', err);
      }
    }

    localOrders.unshift(newOrder);
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*), payment:payments(*)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getOrders error:', err);
      }
    }
    return localOrders;
  },

  // --- SETTINGS ---
  async getStoreSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getStoreSettings error:', err);
      }
    }
    return localSettings;
  },

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('settings')
          .update(settings)
          .eq('id', localSettings.id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase updateStoreSettings error:', err);
      }
    }
    localSettings = { ...localSettings, ...settings };
    return localSettings;
  },
};
