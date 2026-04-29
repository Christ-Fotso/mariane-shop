INSERT INTO "Product" (id, name, description, price, images, updated_at) VALUES 
('prod_1', 'Sac à main Élégance', 'Sac en cuir véritable avec finitions dorées.', 25000, ARRAY['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&auto=format&fit=crop&q=60']::text[], NOW()),
('prod_2', 'Robe de soirée Velours', 'Magnifique robe longue pour vos soirées chics.', 35000, ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=60']::text[], NOW()),
('prod_3', 'Montre Or & Diamants (Imitation)', 'Une touche de luxe pour votre poignet.', 15000, ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60']::text[], NOW()),
('prod_4', 'Escarpins Noirs Classiques', 'L''indispensable de votre garde-robe.', 20000, ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60']::text[], NOW()),
('prod_5', 'Palette de Maquillage Pro', 'Des couleurs vibrantes pour un look parfait.', 12000, ARRAY['https://images.unsplash.com/photo-1512496115841-db0aaf4e056?w=500&auto=format&fit=crop&q=60']::text[], NOW()),
('prod_6', 'Parfum Séduction', 'Fragrance florale et boisée, tenue longue durée.', 45000, ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60']::text[], NOW())
ON CONFLICT (id) DO NOTHING;
