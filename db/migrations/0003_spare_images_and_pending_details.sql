UPDATE spares
SET name = 'Engine air filter',
    part_number = 'PENDING-001',
    condition = 'new',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/engineairfilter.jpeg',
    images_json = '["/assets/engineairfilter.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-engine-filter' AND is_sample = 1;

UPDATE spares
SET name = 'Front brake pad set',
    part_number = 'PENDING-002',
    condition = 'new',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/frontbreakpads.jpeg',
    images_json = '["/assets/frontbreakpads.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-brake-pads' AND is_sample = 1;

UPDATE spares
SET name = 'Rear shock absorber',
    part_number = 'PENDING-003',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/shockabosorber.jpeg',
    images_json = '["/assets/shockabosorber.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-shock-absorber' AND is_sample = 1;

UPDATE spares
SET name = 'Side mirror assembly',
    part_number = 'PENDING-004',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/sidemirror.jpeg',
    images_json = '["/assets/sidemirror.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-side-mirror' AND is_sample = 1;

UPDATE spares
SET name = 'Alternator',
    part_number = 'PENDING-005',
    condition = 'new',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/Alternator.jpeg',
    images_json = '["/assets/Alternator.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-alternator' AND is_sample = 1;

UPDATE spares
SET name = 'Alloy wheel',
    part_number = 'PENDING-006',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/alloywheel.jpg',
    images_json = '["/assets/alloywheel.jpg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-wheel' AND is_sample = 1;

UPDATE spares
SET name = 'Oil filter',
    part_number = 'PENDING-007',
    condition = 'new',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/oilfilter.jpeg',
    images_json = '["/assets/oilfilter.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-oil-filter' AND is_sample = 1;

UPDATE spares
SET name = 'Headlamp assembly',
    part_number = 'PENDING-008',
    condition = 'new',
    grade = NULL,
    price = 0,
    stock = 0,
    description = 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image = '/assets/headlamp.jpeg',
    images_json = '["/assets/headlamp.jpeg"]',
    is_sample = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-headlamp' AND is_sample = 1;

DELETE FROM spare_compatibility
WHERE spare_id IN (
  'sample-engine-filter',
  'sample-brake-pads',
  'sample-shock-absorber',
  'sample-side-mirror',
  'sample-alternator',
  'sample-wheel',
  'sample-oil-filter',
  'sample-headlamp'
)
AND EXISTS (
  SELECT 1 FROM spares
  WHERE spares.id = spare_compatibility.spare_id AND spares.is_sample = 1
);
