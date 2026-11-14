-- ==============================================================================
-- ATB ACCESSORIES AURA - SUPABASE SEED DATA
-- Copy and paste this script into your Supabase SQL Editor and click "Run".
-- This will immediately populate all Categories, Brands, Products, Sliders & Settings!
-- ==============================================================================

-- 1. Insert Store Settings with your actual store info
INSERT INTO settings (
  id, store_name, logo_url, whatsapp_number, bkash_number, nagad_number, rocket_number,
  delivery_charge_inside_dhaka, delivery_charge_outside_dhaka, admin_notification_email
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ATB ACCESSORIES AURA',
  '/logo.png',
  '+8801706312594',
  '01706-312594',
  '01706-312594',
  '01706-312594',
  60.00,
  120.00,
  'atbaccessories30@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  whatsapp_number = EXCLUDED.whatsapp_number,
  bkash_number = EXCLUDED.bkash_number,
  nagad_number = EXCLUDED.nagad_number,
  rocket_number = EXCLUDED.rocket_number,
  delivery_charge_inside_dhaka = EXCLUDED.delivery_charge_inside_dhaka,
  delivery_charge_outside_dhaka = EXCLUDED.delivery_charge_outside_dhaka,
  admin_notification_email = EXCLUDED.admin_notification_email;

-- 2. Insert Main Categories matching the live website navigation
INSERT INTO categories (id, name, slug, description, image_url, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Charger', 'charger', 'Authentic fast chargers, GaN adapters & MagSafe wireless chargers with official warranty in Bangladesh.', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', 1),
  ('c1000000-0000-0000-0000-000000000002', 'AirPods / Bluetooth', 'airpods-bluetooth', 'Original Apple AirPods, Pro ANC TWS earbuds & high fidelity wireless earphones.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Cables', 'cables', 'Durable braided Type-C, Lightning, 100W PD fast charging & data sync cables.', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Earphones / Neckbands', 'earphones-neckbands', 'Deep bass magnetic neckbands, Type-C in-ear earphones & gaming headsets.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Speaker', 'speaker', 'Waterproof portable bluetooth speakers with extra bass and long battery backup.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Power Bank', 'power-bank', 'High-capacity 10000mAh, 20000mAh & 24000mAh PD fast charging power banks.', 'https://images.unsplash.com/photo-1609592424368-ffc94e43f114?w=600&auto=format&fit=crop&q=80', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Smart Watch', 'smart-watch', 'AMOLED display smart watches with Bluetooth calling, health tracking & long battery life.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 7)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- 3. Insert Brands
INSERT INTO brands (id, name, slug, description)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Anker', 'anker', 'World leader in fast charging & audio technology.'),
  ('b1000000-0000-0000-0000-000000000002', 'Apple', 'apple', 'Official Apple accessories, AirPods, MagSafe adapters.'),
  ('b1000000-0000-0000-0000-000000000003', 'Samsung', 'samsung', 'Genuine Samsung fast chargers, AKG earphones & smart gear.'),
  ('b1000000-0000-0000-0000-000000000004', 'Baseus', 'baseus', 'Premium minimalist gadgets, GaN chargers & car accessories.'),
  ('b1000000-0000-0000-0000-000000000005', 'Joyroom', 'joyroom', 'Trendy audio gear, fast chargers and wireless accessories.'),
  ('b1000000-0000-0000-0000-000000000006', 'Havit', 'havit', 'Affordable high performance gaming and audio accessories.'),
  ('b1000000-0000-0000-0000-000000000007', 'Remax', 'remax', 'Stylish fashion-forward power banks, cables and lifestyle gadgets.'),
  ('b1000000-0000-0000-0000-000000000008', 'Oraimo', 'oraimo', 'Smart accessories designed for superior durability.')
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Subcategories
INSERT INTO subcategories (id, category_id, name, slug)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Fast Chargers', 'fast-chargers'),
  ('s1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Wireless Chargers', 'wireless-chargers'),
  ('s1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'TWS Earbuds', 'tws-earbuds'),
  ('s1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', 'Type-C Cables', 'type-c-cables'),
  ('s1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'Lightning Cables', 'lightning-cables'),
  ('s1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000004', 'Bluetooth Neckbands', 'bluetooth-neckbands'),
  ('s1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000005', 'Portable Speakers', 'portable-speakers'),
  ('s1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000006', '20000mAh Power Banks', '20000mah-power-banks'),
  ('s1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000007', 'Calling Smart Watches', 'calling-smart-watches')
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Featured Products
INSERT INTO products (
  id, title, slug, category_id, subcategory_id, brand_id, price, discount_price,
  stock_quantity, sku, model_no, description, images, is_active, is_featured, is_new_arrival
)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Anker 737 Power Bank (PowerCore 24K) 24,000mAh 140W',
    'anker-737-power-bank-24000mah-140w',
    'c1000000-0000-0000-0000-000000000006',
    's1000000-0000-0000-0000-000000000008',
    'b1000000-0000-0000-0000-000000000001',
    14990.00,
    12990.00,
    15,
    'ANK-737-24K',
    'A1289',
    'Ultra-powerful two-way charging with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or get a 140W ultra-powerful charge. Smart digital display shows output and input power.',
    ARRAY['https://images.unsplash.com/photo-1609592424368-ffc94e43f114?w=800&auto=format&fit=crop&q=80'],
    true, true, true
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Apple 20W USB-C Power Adapter (Original)',
    'apple-20w-usb-c-power-adapter',
    'c1000000-0000-0000-0000-000000000001',
    's1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    2750.00,
    2350.00,
    30,
    'APL-20W-ADP',
    'MHJE3ZP/A',
    'The Apple 20W USB‑C Power Adapter offers fast, efficient charging at home, in the office, or on the go. Compatible with iPhone 12, 13, 14, 15, and 16 series.',
    ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'],
    true, true, false
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Apple AirPods Pro (2nd Generation) with MagSafe USB-C',
    'apple-airpods-pro-2nd-gen-usb-c',
    'c1000000-0000-0000-0000-000000000002',
    's1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    28500.00,
    25990.00,
    8,
    'APL-APP2-USBC',
    'MTJV3AM/A',
    'AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Audio and Transparency mode. Up to 6 hours of listening time with a single charge.',
    ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    true, true, true
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Anker PowerLine III Flow USB-C to Lightning Cable 3ft',
    'anker-powerline-iii-flow-usbc-lightning',
    'c1000000-0000-0000-0000-000000000003',
    's1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000001',
    1650.00,
    1390.00,
    25,
    'ANK-PL3F-LGT',
    'A8662',
    'Soft to the touch, silicone finish, tangle-free durability rated for 25,000 bends. MFi certified for flawless compatibility with Apple Lightning devices.',
    ARRAY['https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80'],
    true, true, false
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Baseus GaN5 Pro 65W Fast Charger (2 Type-C + 1 USB)',
    'baseus-gan5-pro-65w-fast-charger',
    'c1000000-0000-0000-0000-000000000001',
    's1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000004',
    3450.00,
    2950.00,
    18,
    'BAS-GAN5-65W',
    'CCGP120201',
    'Upgraded GaN5 technology delivers fast 65W charging for laptops, tablets, and smartphones simultaneously with BPS II smart power distribution.',
    ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'],
    true, true, true
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Samsung 25W Super Fast Travel Adapter (Type-C)',
    'samsung-25w-super-fast-adapter',
    'c1000000-0000-0000-0000-000000000001',
    's1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000003',
    2100.00,
    1790.00,
    20,
    'SAM-25W-TA',
    'EP-TA800',
    'Super Fast Charging up to 25W with compatible devices. Authentic Samsung OEM warranty.',
    ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'],
    true, true, false
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'Oraimo Shark 4 Magnetic Wireless Neckband Earphone',
    'oraimo-shark-4-magnetic-neckband',
    'c1000000-0000-0000-0000-000000000004',
    's1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000008',
    1950.00,
    1650.00,
    22,
    'ORM-SHK4-BLK',
    'OEB-E30D',
    'HavyBass dual EQ mode, 20 hours battery life, low-latency gaming mode and magnetic snap buds.',
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    true, true, false
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Joyroom JR-T03S Pro ANC True Wireless Earbuds',
    'joyroom-jr-t03s-pro-anc-tws',
    'c1000000-0000-0000-0000-000000000002',
    's1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000005',
    3200.00,
    2650.00,
    14,
    'JOY-T03S-PRO',
    'JR-T03S Pro',
    'Active Noise Cancellation, smart touch sensor, wireless Qi charging case included with silicone protective cover.',
    ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    true, true, false
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  stock_quantity = EXCLUDED.stock_quantity,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- 6. Insert Hero Sliders
INSERT INTO sliders (id, title, subtitle, image_url, link, display_order, is_active)
VALUES
  (
    'sl000000-0000-0000-0000-000000000001',
    'Official Anker 140W GaN Power Gear',
    'Buy genuine fast chargers & power banks with official warranty in Bangladesh.',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1600&auto=format&fit=crop&q=80',
    '/category/charger',
    1,
    true
  ),
  (
    'sl000000-0000-0000-0000-000000000002',
    'Original Apple AirPods & Accessories',
    '100% authentic Apple 20W chargers, AirPods Pro 2 & MagSafe gear at best prices.',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&auto=format&fit=crop&q=80',
    '/category/airpods-bluetooth',
    2,
    true
  )
ON CONFLICT (id) DO NOTHING;
