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

const STORAGE_KEYS = {
  PRODUCTS: 'atb_store_products_v2',
  CATEGORIES: 'atb_store_categories_v2',
  BRANDS: 'atb_store_brands_v2',
  ORDERS: 'atb_store_orders_v2',
  SLIDERS: 'atb_store_sliders_v2',
  SETTINGS: 'atb_store_settings_v2',
};

// Safe localStorage getters
function getStoredProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading products from localStorage', err);
    }
  }
  return [...INITIAL_PRODUCTS];
}

function saveStoredProducts(prods: Product[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
      window.dispatchEvent(new Event('atb_store_updated'));
    } catch (err) {
      console.error('Error saving products to localStorage', err);
    }
  }
}

function getStoredCategories(): Category[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error reading categories from localStorage', err);
    }
  }
  return [...INITIAL_CATEGORIES];
}

function saveStoredCategories(cats: Category[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
      window.dispatchEvent(new Event('atb_categories_updated'));
    } catch (err) {
      console.error('Error saving categories to localStorage', err);
    }
  }
}

function getStoredOrders(): Order[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (err) {}
  }
  return [];
}

function saveStoredOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {}
  }
}

function getStoredSliders(): Slider[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SLIDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error reading sliders from localStorage', err);
    }
  }
  return [...INITIAL_SLIDERS];
}

function saveStoredSliders(sliders: Slider[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.SLIDERS, JSON.stringify(sliders));
      window.dispatchEvent(new Event('atb_sliders_updated'));
    } catch (err) {
      console.error('Error saving sliders to localStorage', err);
    }
  }
}

function getStoredBrands(): Brand[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {}
  }
  return [...INITIAL_BRANDS];
}

function saveStoredBrands(brands: Brand[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      window.dispatchEvent(new Event('atb_brands_updated'));
    } catch (err) {}
  }
}

let localSubcategories = [...INITIAL_SUBCATEGORIES];
let localSettings = { ...INITIAL_SETTINGS };

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
    return getStoredCategories();
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured() && supabase) {
      try {
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
      } catch (err) {
        console.error('Supabase saveCategory error:', err);
      }
    }

    const current = getStoredCategories();
    if (category.id) {
      const updated = current.map((c) =>
        c.id === category.id ? ({ ...c, ...category } as Category) : c
      );
      saveStoredCategories(updated);
      return updated.find((c) => c.id === category.id)!;
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: category.name || 'New Category',
        slug: category.slug || `category-${Date.now()}`,
        description: category.description || '',
        image_url: category.image_url || '',
        display_order: category.display_order || current.length + 1,
        created_at: new Date().toISOString(),
      };
      const updated = [...current, newCat];
      saveStoredCategories(updated);
      return newCat;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {}
    }
    const current = getStoredCategories();
    saveStoredCategories(current.filter((c) => c.id !== id));
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
      } catch (err) {}
    }
    return categoryId
      ? localSubcategories.filter((s) => s.category_id === categoryId)
      : localSubcategories;
  },

  async saveSubcategory(sub: Partial<Subcategory>): Promise<Subcategory> {
    const newSub: Subcategory = {
      id: sub.id || `sub-${Date.now()}`,
      category_id: sub.category_id || '',
      name: sub.name || 'New Subcategory',
      slug: sub.slug || `sub-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    localSubcategories.push(newSub);
    return newSub;
  },

  async deleteSubcategory(id: string): Promise<boolean> {
    localSubcategories = localSubcategories.filter((s) => s.id !== id);
    return true;
  },

  // --- BRANDS ---
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('brands').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {}
    }
    return getStoredBrands();
  },

  async saveBrand(brand: Partial<Brand>): Promise<Brand> {
    const current = await this.getBrands();
    let updatedBrand: Brand;
    if (brand.id) {
      updatedBrand = {
        ...current.find((b) => b.id === brand.id)!,
        ...brand,
      } as Brand;
      const updated = current.map((b) => (b.id === brand.id ? updatedBrand : b));
      saveStoredBrands(updated);
    } else {
      updatedBrand = {
        id: `brand-${Date.now()}`,
        name: brand.name || 'New Brand',
        slug: brand.slug || `brand-${Date.now()}`,
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        created_at: new Date().toISOString(),
      };
      saveStoredBrands([...current, updatedBrand]);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('brands').upsert(updatedBrand);
      } catch (err) {}
    }
    return updatedBrand;
  },

  async deleteBrand(id: string): Promise<boolean> {
    const current = await this.getBrands();
    saveStoredBrands(current.filter((b) => b.id !== id));
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('brands').delete().eq('id', id);
      } catch (err) {}
    }
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
      } catch (err) {}
    }
    return getStoredSliders();
  },

  async getSliderById(id: string): Promise<Slider | null> {
    const list = await this.getSliders();
    return list.find((s) => s.id === id) || null;
  },

  async saveSlider(sliderData: Partial<Slider> & { id?: string }): Promise<Slider> {
    const current = await this.getSliders();
    let updatedSlider: Slider;

    if (sliderData.id) {
      const existing = current.find((s) => s.id === sliderData.id);
      updatedSlider = {
        ...(existing || { id: sliderData.id }),
        ...sliderData,
      } as Slider;
      const updatedList = current.map((s) => (s.id === sliderData.id ? updatedSlider : s));
      saveStoredSliders(updatedList);
    } else {
      updatedSlider = {
        id: `sl-${Date.now()}`,
        title: sliderData.title || 'New Banner Slide',
        subtitle: sliderData.subtitle || '',
        image_url: sliderData.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&auto=format&fit=crop&q=80',
        link: sliderData.link || '/category/charger',
        display_order: sliderData.display_order ?? (current.length + 1),
        is_active: sliderData.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      saveStoredSliders([...current, updatedSlider]);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('sliders').upsert(updatedSlider);
      } catch (err) {}
    }
    return updatedSlider;
  },

  async deleteSlider(id: string): Promise<boolean> {
    const current = await this.getSliders();
    saveStoredSliders(current.filter((s) => s.id !== id));
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('sliders').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
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
          if (options?.categorySlug) {
            const categories = await this.getCategories();
            const cat = categories.find((c) => c.slug.toLowerCase() === options.categorySlug?.toLowerCase());
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

    const currentCats = await this.getCategories();
    const currentBrands = await this.getBrands();
    let result = getStoredProducts();

    if (!options?.includeInactive) result = result.filter((p) => p.is_active);
    if (options?.featuredOnly) result = result.filter((p) => p.is_featured);
    if (options?.newArrivalsOnly) result = result.filter((p) => p.is_new_arrival);

    if (options?.categorySlug) {
      const category = currentCats.find(
        (c) => c.slug.toLowerCase() === options.categorySlug?.toLowerCase()
      );
      if (category) {
        result = result.filter((p) => p.category_id === category.id);
      }
    }

    if (options?.brandSlug) {
      const brand = currentBrands.find(
        (b) => b.slug.toLowerCase() === options.brandSlug?.toLowerCase()
      );
      if (brand) {
        result = result.filter((p) => p.brand_id === brand.id);
      }
    }

    if (options?.limit) result = result.slice(0, options.limit);

    return result.map((p) => {
      const category = currentCats.find((c) => c.id === p.category_id);
      const subcategory = localSubcategories.find((s) => s.id === p.subcategory_id);
      const brand = currentBrands.find((b) => b.id === p.brand_id);
      return { ...p, category, subcategory, brand };
    });
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {}
    }
    const currentProds = getStoredProducts();
    const found = currentProds.find((p) => p.id === id);
    if (!found) return null;
    const currentCats = await this.getCategories();
    const currentBrands = await this.getBrands();
    const category = currentCats.find((c) => c.id === found.category_id);
    const subcategory = localSubcategories.find((s) => s.id === found.subcategory_id);
    const brand = currentBrands.find((b) => b.id === found.brand_id);
    return { ...found, category, subcategory, brand };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (!error && data) return data;
      } catch (err) {}
    }
    const currentProds = getStoredProducts();
    const found = currentProds.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!found) return null;
    const currentCats = await this.getCategories();
    const currentBrands = await this.getBrands();
    const category = currentCats.find((c) => c.id === found.category_id);
    const subcategory = localSubcategories.find((s) => s.id === found.subcategory_id);
    const brand = currentBrands.find((b) => b.id === found.brand_id);
    return { ...found, category, subcategory, brand };
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    if (isSupabaseConfigured() && supabase) {
      try {
        if (product.id) {
          const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
          if (!error && data) return data;
        } else {
          const { data, error } = await supabase.from('products').insert(product).select().single();
          if (!error && data) return data;
        }
      } catch (err) {
        console.error('Supabase saveProduct error:', err);
      }
    }

    const currentProds = getStoredProducts();
    if (product.id) {
      const updated = currentProds.map((p) =>
        p.id === product.id ? ({ ...p, ...product } as Product) : p
      );
      saveStoredProducts(updated);
      return updated.find((p) => p.id === product.id)!;
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
        sku: product.sku || `ATB-${Math.floor(1000 + Math.random() * 9000)}`,
        model_no: product.model_no || '',
        description: product.description || '',
        images: product.images && product.images.length > 0 ? product.images : [
          'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
        ],
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? true,
        is_new_arrival: product.is_new_arrival ?? true,
        created_at: new Date().toISOString(),
      };
      const updated = [newProd, ...currentProds];
      saveStoredProducts(updated);
      return newProd;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {}
    }
    const currentProds = getStoredProducts();
    saveStoredProducts(currentProds.filter((p) => p.id !== id));
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
          return { ...newOrder, id: data.id };
        }
      } catch (err) {}
    }

    const currentOrders = getStoredOrders();
    const updated = [newOrder, ...currentOrders];
    saveStoredOrders(updated);
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
      } catch (err) {}
    }
    return getStoredOrders();
  },

  async updateOrderStatus(orderId: string, status: any): Promise<Order | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase updateOrderStatus error:', err);
      }
    }

    const currentOrders = getStoredOrders();
    const updated = currentOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveStoredOrders(updated);

    const target = updated.find((o) => o.id === orderId);
    if (target && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`order_${target.order_number}`, JSON.stringify(target));
      } catch (e) {}
    }
    return target || null;
  },

  // --- SETTINGS ---
  async getStoreSettings(): Promise<StoreSettings> {
    return localSettings;
  },

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    localSettings = { ...localSettings, ...settings };
    return localSettings;
  },
};
