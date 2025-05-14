-- Seed data for testing purposes

-- Insert Categories
INSERT INTO public.categories (id, name, description, slug)
VALUES 
    ('d1c94caa-ba8c-4866-9b54-7a5560a9e18a', 'Sushi', 'Traditional and fusion sushi options', 'sushi'),
    ('2f5a2dee-0715-4097-a784-b31bb3f13f56', 'Sashimi', 'Fresh sliced raw fish', 'sashimi'),
    ('ea06addd-78f6-4bf8-9300-145724adc50f', 'Rolls', 'Various maki and specialty rolls', 'rolls'),
    ('1d0bde62-69f4-4e48-8bea-0e82c7c95624', 'Appetizers', 'Starters and small plates', 'appetizers'),
    ('c2e3e3d1-9fc2-4e59-a322-fdd452f8db76', 'Drinks', 'Beverages including sake and tea', 'drinks');

-- Insert Products
INSERT INTO public.products (id, title, description, price, category_id, slug, is_available)
VALUES
    -- Sushi
    ('f0bf5e6c-6074-4f62-9a37-0cc806d76946', 'Tuna Nigiri', 'Fresh tuna on pressed rice', 6.99, 'd1c94caa-ba8c-4866-9b54-7a5560a9e18a', 'tuna-nigiri', true),
    ('3685c765-9d99-4731-845d-46d84e555b47', 'Salmon Nigiri', 'Fresh salmon on pressed rice', 6.99, 'd1c94caa-ba8c-4866-9b54-7a5560a9e18a', 'salmon-nigiri', true),
    ('f3e2e9e6-956a-4c56-b8dd-e652c5c0b4e4', 'Yellowtail Nigiri', 'Fresh yellowtail on pressed rice', 7.99, 'd1c94caa-ba8c-4866-9b54-7a5560a9e18a', 'yellowtail-nigiri', true),
    
    -- Sashimi
    ('35644be9-5421-4aa9-bc42-c9859e8e4d5d', 'Tuna Sashimi', '5 pieces of fresh sliced tuna', 12.99, '2f5a2dee-0715-4097-a784-b31bb3f13f56', 'tuna-sashimi', true),
    ('a7c8a315-ec78-4add-b14a-d6822a2f5e83', 'Salmon Sashimi', '5 pieces of fresh sliced salmon', 11.99, '2f5a2dee-0715-4097-a784-b31bb3f13f56', 'salmon-sashimi', true),
    
    -- Rolls
    ('867a7d8d-8661-41c0-997b-211b5427e3fc', 'California Roll', 'Crab, avocado, cucumber', 8.99, 'ea06addd-78f6-4bf8-9300-145724adc50f', 'california-roll', true),
    ('dcd0cc0b-f797-4cf2-a492-3e8d5f967626', 'Spicy Tuna Roll', 'Spicy tuna, cucumber, spicy mayo', 10.99, 'ea06addd-78f6-4bf8-9300-145724adc50f', 'spicy-tuna-roll', true),
    ('6d1d933e-e50a-4a75-b550-8dd8cdb9b3c1', 'Dragon Roll', 'Eel, avocado, cucumber, topped with avocado', 16.99, 'ea06addd-78f6-4bf8-9300-145724adc50f', 'dragon-roll', true),
    
    -- Appetizers
    ('66c41b47-b614-4f1a-b492-c1c23d497e84', 'Edamame', 'Steamed soy beans with sea salt', 5.99, '1d0bde62-69f4-4e48-8bea-0e82c7c95624', 'edamame', true),
    ('e9da2304-f0a1-4f41-b56c-6fd563f7a30c', 'Gyoza', 'Pan-fried pork dumplings', 7.99, '1d0bde62-69f4-4e48-8bea-0e82c7c95624', 'gyoza', true),
    
    -- Drinks
    ('f2dfe756-6c6d-4baa-bbd8-7f13b9c5621e', 'Green Tea', 'Traditional Japanese green tea', 3.50, 'c2e3e3d1-9fc2-4e59-a322-fdd452f8db76', 'green-tea', true),
    ('ccbf0632-9f96-49e5-aff9-faec044b5ecd', 'House Sake', 'Traditional Japanese rice wine (small)', 8.99, 'c2e3e3d1-9fc2-4e59-a322-fdd452f8db76', 'house-sake', true);

-- Insert an admin user (only for development purposes)
-- In production, users should be created through the authentication system
INSERT INTO public.users (id, email, full_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'admin@sushisamurai.com', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;
