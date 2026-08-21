-- Seed products
INSERT INTO products (barcode, name, unit, image_url, status) VALUES
('8851959131048', 'น้ำดื่ม Crystal 600ml', 'ขวด', '/images/crystal-600ml.jpg', true),
('8850999220017', 'มาม่า รสต้มยำกุ้ง', 'ซอง', '/images/mama-tomyum.jpg', true),
('8851028001089', 'โค้ก 325ml', 'กระป๋อง', '/images/coke-325ml.jpg', true),
('8858891303235', 'ขนมปัง Farmhouse', 'แพ็ค', '/images/farmhouse-bread.jpg', true),
('8851123312345', 'นมสด Meiji 200ml', 'กล่อง', '/images/meiji-milk-200ml.jpg', true);

-- Seed product prices
INSERT INTO product_prices (product_id, price, effective_from, effective_to) VALUES
(1, 7.00, '2026-01-01 00:00:00', '2026-03-01 00:00:00'),
(1, 10.00, '2026-03-01 00:00:00', '2026-06-01 00:00:00'),
(1, 15.00, '2026-06-01 00:00:00', NULL);

INSERT INTO product_prices (product_id, price, effective_from, effective_to) VALUES
(2, 6.00, '2026-01-01 00:00:00', '2026-04-01 00:00:00'),
(2, 7.00, '2026-04-01 00:00:00', NULL);

INSERT INTO product_prices (product_id, price, effective_from, effective_to) VALUES
(3, 15.00, '2026-01-01 00:00:00', '2026-05-01 00:00:00'),
(3, 18.00, '2026-05-01 00:00:00', NULL);

INSERT INTO product_prices (product_id, price, effective_from, effective_to) VALUES
(4, 35.00, '2026-01-01 00:00:00', NULL);

INSERT INTO product_prices (product_id, price, effective_from, effective_to) VALUES
(5, 14.00, '2026-01-01 00:00:00', '2026-02-01 00:00:00'),
(5, 16.00, '2026-02-01 00:00:00', NULL);
