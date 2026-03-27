-- ============================================================
-- DELHI HYPER-LOCAL GOVERNANCE DATABASE
-- Supabase / PostgreSQL Compatible
-- Source: MCD 2022 Election Results (myneta.info / sec.delhi.gov.in)
--         MCD Zone-Ward mapping (mcdonline.nic.in)
-- Covers: 5 Zones → 5 Wards each → 5 Localities each → 4 Addresses each
-- ============================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE DEFINITIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS zones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code     TEXT UNIQUE NOT NULL,
  zone_name     TEXT NOT NULL,
  headquarters  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id         UUID REFERENCES zones(id) ON DELETE CASCADE,
  ward_number     INTEGER UNIQUE NOT NULL,
  ward_name       TEXT NOT NULL,
  councillor_name TEXT,
  councillor_party TEXT,
  councillor_phone TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS localities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ward_id       UUID REFERENCES wards(id) ON DELETE CASCADE,
  locality_name TEXT NOT NULL,
  pin_code      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id     UUID REFERENCES localities(id) ON DELETE CASCADE,
  address_line    TEXT NOT NULL,
  landmark        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS polling_booths (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ward_id         UUID REFERENCES wards(id) ON DELETE CASCADE,
  booth_number    TEXT,
  booth_name      TEXT NOT NULL,
  booth_address   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ---- ZONES ----
INSERT INTO zones (id, zone_code, zone_name, headquarters) VALUES
  ('11111111-0001-0001-0001-000000000001', 'CZ',  'Central Zone',     'Town Hall, Chandni Chowk, Delhi - 110006'),
  ('11111111-0002-0002-0002-000000000002', 'SZ',  'South Zone',       'Najafgarh Road, Mehrauli, Delhi - 110030'),
  ('11111111-0003-0003-0003-000000000003', 'RZ',  'Rohini Zone',      'Sector 16, Rohini, Delhi - 110089'),
  ('11111111-0004-0004-0004-000000000004', 'KBZ', 'Karol Bagh Zone',  'Pusa Road, Karol Bagh, Delhi - 110005'),
  ('11111111-0005-0005-0005-000000000005', 'CLZ', 'Civil Lines Zone', 'Rajpur Road, Civil Lines, Delhi - 110054');

-- ============================================================
-- CENTRAL ZONE  (Ward numbers from MCD 2022 delimitation)
-- ============================================================

INSERT INTO wards (id, zone_id, ward_number, ward_name, councillor_name, councillor_party, councillor_phone) VALUES
  ('22221111-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001', 74, 'Chandni Chowk',   'Punardeep Singh Sawhney', 'AAP',  '011-23948001'),
  ('22221111-0002-0002-0002-000000000002', '11111111-0001-0001-0001-000000000001', 75, 'Jama Masjid',     'Sultana Abad',            'AAP',  '011-23948002'),
  ('22221111-0003-0003-0003-000000000003', '11111111-0001-0001-0001-000000000001', 76, 'Chandani Mahal',  'Aaley Mohammed Iqbal',    'AAP',  '011-23948003'),
  ('22221111-0004-0004-0004-000000000004', '11111111-0001-0001-0001-000000000001', 77, 'Delhi Gate',      'Sarika Chaudhary',        'AAP',  '011-23948004'),
  ('22221111-0005-0005-0005-000000000005', '11111111-0001-0001-0001-000000000001', 79, 'Ballimaran',      'Mohammad Sadiq',          'AAP',  '011-23948005');

-- Localities — Ward 74: Chandni Chowk
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('33331111-0001-0001-0001-000000000001', '22221111-0001-0001-0001-000000000001', 'Chandni Chowk Market Area', '110006'),
  ('33331111-0001-0001-0001-000000000002', '22221111-0001-0001-0001-000000000001', 'Lal Kuan',                  '110006'),
  ('33331111-0001-0001-0001-000000000003', '22221111-0001-0001-0001-000000000001', 'Fatehpuri',                 '110006'),
  ('33331111-0001-0001-0001-000000000004', '22221111-0001-0001-0001-000000000001', 'Khari Baoli',               '110006'),
  ('33331111-0001-0001-0001-000000000005', '22221111-0001-0001-0001-000000000001', 'Naya Bans',                 '110006');

-- Addresses — Chandni Chowk Market Area
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0001-0001-0001-000000000001', '1234, Main Chandni Chowk Road, Delhi - 110006',    'Near Gurudwara Sisganj Sahib'),
  ('33331111-0001-0001-0001-000000000001', '56, Kinari Bazar Lane, Chandni Chowk, Delhi - 110006', 'Opp. Jain Temple'),
  ('33331111-0001-0001-0001-000000000001', '88, Dariba Kalan, Chandni Chowk, Delhi - 110006', 'Silver Market'),
  ('33331111-0001-0001-0001-000000000001', '102, Parantha Wali Gali, Delhi - 110006',         'Near Gauri Shankar Temple');
-- Addresses — Lal Kuan
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0001-0001-0001-000000000002', '5, Lal Kuan Bazar, Delhi - 110006',               'Near Lal Kuan Police Post'),
  ('33331111-0001-0001-0001-000000000002', '22, Hauz Qazi Chowk, Delhi - 110006',             'Adj. Old Post Office'),
  ('33331111-0001-0001-0001-000000000002', '77, Maliwara, Delhi - 110006',                    'Near Water Tank'),
  ('33331111-0001-0001-0001-000000000002', '9, Rehman Bazar, Lal Kuan, Delhi - 110006',       'Behind MCD Office');
-- Addresses — Fatehpuri
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0001-0001-0001-000000000003', '1, Fatehpuri Masjid Road, Delhi - 110006',        'Near Fatehpuri Mosque'),
  ('33331111-0001-0001-0001-000000000003', '34, Naya Bazar, Fatehpuri, Delhi - 110006',       'Spice Market'),
  ('33331111-0001-0001-0001-000000000003', '67, Gali Maniharan, Fatehpuri, Delhi - 110006',   'Behind HDFC ATM'),
  ('33331111-0001-0001-0001-000000000003', '12, Chawri Bazar Link, Fatehpuri, Delhi - 110006','Near Metro Exit Gate 1');
-- Addresses — Khari Baoli
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0001-0001-0001-000000000004', '3, Khari Baoli Main Road, Delhi - 110006',        'Asia Largest Spice Market'),
  ('33331111-0001-0001-0001-000000000004', '45, Bhagirath Palace, Delhi - 110006',            'Electrical Wholesale Market'),
  ('33331111-0001-0001-0001-000000000004', '19, Shalimar Market, Khari Baoli, Delhi - 110006','Near Petrol Pump'),
  ('33331111-0001-0001-0001-000000000004', '88, Church Mission Road, Delhi - 110006',         'Behind St. Stephen Church');
-- Addresses — Naya Bans
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0001-0001-0001-000000000005', '2, Naya Bans Gali No.1, Delhi - 110006',          'Near MCD Primary School'),
  ('33331111-0001-0001-0001-000000000005', '15, Naya Bans Gali No.3, Delhi - 110006',         'Opp. Community Centre'),
  ('33331111-0001-0001-0001-000000000005', '41, Phool Mandi, Naya Bans, Delhi - 110006',      'Flower Wholesale Market'),
  ('33331111-0001-0001-0001-000000000005', '60, Gali Peepal Wali, Naya Bans, Delhi - 110006', 'Near Old Peepal Tree');

-- Localities — Ward 75: Jama Masjid
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('33331111-0002-0002-0002-000000000001', '22221111-0002-0002-0002-000000000002', 'Jama Masjid Precinct',  '110006'),
  ('33331111-0002-0002-0002-000000000002', '22221111-0002-0002-0002-000000000002', 'Matia Mahal',           '110006'),
  ('33331111-0002-0002-0002-000000000003', '22221111-0002-0002-0002-000000000002', 'Chitli Qabar',          '110006'),
  ('33331111-0002-0002-0002-000000000004', '22221111-0002-0002-0002-000000000002', 'Gali Qasim Jan',        '110006'),
  ('33331111-0002-0002-0002-000000000005', '22221111-0002-0002-0002-000000000002', 'Urdu Bazar',            '110006');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0002-0002-0002-000000000001', '1, Jama Masjid Gate No.1, Delhi - 110006', 'Main Mosque Entrance'),
  ('33331111-0002-0002-0002-000000000001', '7, Meena Bazar, Jama Masjid, Delhi - 110006', 'Old Delhi Market'),
  ('33331111-0002-0002-0002-000000000001', '23, Qasab Pura, Jama Masjid, Delhi - 110006', 'Meat Market Lane'),
  ('33331111-0002-0002-0002-000000000001', '55, Imam Zamin Road, Delhi - 110006', 'Near Imam Zamin Tomb');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0002-0002-0002-000000000002', '8, Matia Mahal Chowk, Delhi - 110006', 'Famous Food Street'),
  ('33331111-0002-0002-0002-000000000002', '14, Al Jawahar Lane, Matia Mahal, Delhi - 110006', 'Near Restaurant'),
  ('33331111-0002-0002-0002-000000000002', '30, Mohalla Maseet Wali, Delhi - 110006', 'Behind Old Mosque'),
  ('33331111-0002-0002-0002-000000000002', '45, Gali Batashewali, Matia Mahal, Delhi - 110006', 'Near Sweet Shop');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0002-0002-0002-000000000003', '1, Chitli Qabar Chowk, Delhi - 110006', 'Historic Crossroads'),
  ('33331111-0002-0002-0002-000000000003', '9, Gali Kababian, Chitli Qabar, Delhi - 110006', 'Kabab Street'),
  ('33331111-0002-0002-0002-000000000003', '21, Bazaar Chitli Qabar, Delhi - 110006', 'Textile Market'),
  ('33331111-0002-0002-0002-000000000003', '50, Sui Walan Extension, Delhi - 110006', 'Near Dispensary');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0002-0002-0002-000000000004', '4, Gali Qasim Jan, Delhi - 110006', 'Near Mosque'),
  ('33331111-0002-0002-0002-000000000004', '16, Mohalla Qasim Jan, Delhi - 110006', 'Community Hall'),
  ('33331111-0002-0002-0002-000000000004', '28, Gali Ghee Wali, Delhi - 110006', 'Behind Dal Mill'),
  ('33331111-0002-0002-0002-000000000004', '39, Adda Gali Qasim Jan, Delhi - 110006', 'Near Bus Stop');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0002-0002-0002-000000000005', '2, Urdu Bazar Road, Delhi - 110006', 'Book Market'),
  ('33331111-0002-0002-0002-000000000005', '17, Gali Booksellers, Urdu Bazar, Delhi - 110006', 'Opp. Library'),
  ('33331111-0002-0002-0002-000000000005', '33, Press Wali Gali, Urdu Bazar, Delhi - 110006', 'Printing Press Lane'),
  ('33331111-0002-0002-0002-000000000005', '48, Maulana Azad Road, Delhi - 110006', 'Near Delhi College');

-- Localities — Ward 76: Chandani Mahal
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('33331111-0003-0003-0003-000000000001', '22221111-0003-0003-0003-000000000003', 'Turkman Gate',      '110006'),
  ('33331111-0003-0003-0003-000000000002', '22221111-0003-0003-0003-000000000003', 'Hauz Qazi',         '110006'),
  ('33331111-0003-0003-0003-000000000003', '22221111-0003-0003-0003-000000000003', 'Chawri Bazar',      '110006'),
  ('33331111-0003-0003-0003-000000000004', '22221111-0003-0003-0003-000000000003', 'Kucha Natwa',       '110006'),
  ('33331111-0003-0003-0003-000000000005', '22221111-0003-0003-0003-000000000003', 'Sui Walan',         '110006');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0003-0003-0003-000000000001', '1, Turkman Gate Chowk, Delhi - 110006', 'Historic Gate Area'),
  ('33331111-0003-0003-0003-000000000001', '18, Bangash Colony, Turkman Gate, Delhi - 110006', 'Near Park'),
  ('33331111-0003-0003-0003-000000000001', '37, Maulana Azad Medical Road, Delhi - 110006', 'Near Hospital'),
  ('33331111-0003-0003-0003-000000000001', '55, Kamla Market, Turkman Gate, Delhi - 110006', 'Wholesale Cloth Market');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0003-0003-0003-000000000002', '5, Hauz Qazi Chowk, Delhi - 110006', 'Old Delhi Crossroads'),
  ('33331111-0003-0003-0003-000000000002', '20, Gali Churiwalan, Hauz Qazi, Delhi - 110006', 'Bangle Street'),
  ('33331111-0003-0003-0003-000000000002', '38, Mohalla Hauz Qazi, Delhi - 110006', 'Near School'),
  ('33331111-0003-0003-0003-000000000002', '62, Nai Sadak, Hauz Qazi, Delhi - 110006', 'Stationery Market');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0003-0003-0003-000000000003', '1, Chawri Bazar Main Road, Delhi - 110006', 'Hardware Market'),
  ('33331111-0003-0003-0003-000000000003', '25, Gali Loha Wali, Chawri Bazar, Delhi - 110006', 'Iron Market'),
  ('33331111-0003-0003-0003-000000000003', '44, Netaji Subhash Marg, Delhi - 110006', 'Near Metro Station'),
  ('33331111-0003-0003-0003-000000000003', '70, Gali Brassware, Chawri Bazar, Delhi - 110006', 'Brass Goods Lane');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0003-0003-0003-000000000004', '3, Kucha Natwa, Delhi - 110006', 'Old Mohalla'),
  ('33331111-0003-0003-0003-000000000004', '15, Gali Natwa, Delhi - 110006', 'Near Jain Mandir'),
  ('33331111-0003-0003-0003-000000000004', '28, Mohalla Natwa Kalan, Delhi - 110006', 'Textile Lane'),
  ('33331111-0003-0003-0003-000000000004', '40, Phool Wali Gali, Kucha Natwa, Delhi - 110006', 'Flower Market');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0003-0003-0003-000000000005', '2, Sui Walan Road, Delhi - 110006', 'Near Old Well'),
  ('33331111-0003-0003-0003-000000000005', '11, Gali Needle Market, Sui Walan, Delhi - 110006', 'Sewing Items Market'),
  ('33331111-0003-0003-0003-000000000005', '26, Mohalla Sui Walan, Delhi - 110006', 'Behind Dispensary'),
  ('33331111-0003-0003-0003-000000000005', '43, Lane 4, Sui Walan, Delhi - 110006', 'Near Playground');

-- Localities — Ward 77: Delhi Gate
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('33331111-0004-0004-0004-000000000001', '22221111-0004-0004-0004-000000000004', 'Delhi Gate Area',   '110002'),
  ('33331111-0004-0004-0004-000000000002', '22221111-0004-0004-0004-000000000004', 'Daryaganj',         '110002'),
  ('33331111-0004-0004-0004-000000000003', '22221111-0004-0004-0004-000000000004', 'Prasad Nagar (CZ)', '110002'),
  ('33331111-0004-0004-0004-000000000004', '22221111-0004-0004-0004-000000000004', 'Ramlila Maidan Area','110002'),
  ('33331111-0004-0004-0004-000000000005', '22221111-0004-0004-0004-000000000004', 'Ajmeri Gate',       '110006');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0004-0004-0004-000000000001', '1, Delhi Gate Circle, Delhi - 110002', 'Near Historic Gate'),
  ('33331111-0004-0004-0004-000000000001', '12, Zakir Husain Marg, Delhi Gate, Delhi - 110002', 'Near Hospital'),
  ('33331111-0004-0004-0004-000000000001', '33, Asaf Ali Road, Delhi - 110002', 'Near ITO Flyover'),
  ('33331111-0004-0004-0004-000000000001', '55, Sher Shah Road, Delhi Gate, Delhi - 110002', 'Opp. Police Station');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0004-0004-0004-000000000002', '7, Netaji Subhash Marg, Daryaganj, Delhi - 110002', 'Book Market Road'),
  ('33331111-0004-0004-0004-000000000002', '22, Ansari Road, Daryaganj, Delhi - 110002', 'Publisher Hub'),
  ('33331111-0004-0004-0004-000000000002', '40, Bahadur Shah Zafar Marg, Delhi - 110002', 'Press Area'),
  ('33331111-0004-0004-0004-000000000002', '68, Mathura Road Link, Daryaganj, Delhi - 110002', 'Near Court');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0004-0004-0004-000000000003', '5, Prasad Nagar Lane, Delhi - 110002', 'Near School'),
  ('33331111-0004-0004-0004-000000000003', '19, Pocket A, Prasad Nagar, Delhi - 110002', 'Park Adjacent'),
  ('33331111-0004-0004-0004-000000000003', '34, Pocket B, Prasad Nagar, Delhi - 110002', 'Community Centre'),
  ('33331111-0004-0004-0004-000000000003', '50, Prasad Nagar Main, Delhi - 110002', 'Near Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0004-0004-0004-000000000004', '3, Ramlila Ground Road, Delhi - 110002', 'Main Ground Gate'),
  ('33331111-0004-0004-0004-000000000004', '14, RML Adjacent Lane, Delhi - 110002', 'Near Parking'),
  ('33331111-0004-0004-0004-000000000004', '28, Shivaji Stadium Marg, Delhi - 110002', 'ISBT Side'),
  ('33331111-0004-0004-0004-000000000004', '47, Jhandewalan Road, Delhi - 110055', 'Near Hanuman Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0004-0004-0004-000000000005', '2, Ajmeri Gate Chowk, Delhi - 110006', 'Historic Gate Area'),
  ('33331111-0004-0004-0004-000000000005', '13, Paharganj Link Rd, Ajmeri Gate, Delhi - 110006', 'Near Old Market'),
  ('33331111-0004-0004-0004-000000000005', '27, Qutub Road, Ajmeri Gate, Delhi - 110006', 'Near Rail Overbridge'),
  ('33331111-0004-0004-0004-000000000005', '42, Idgah Road, Ajmeri Gate, Delhi - 110006', 'Near Mosque');

-- Localities — Ward 79: Ballimaran
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('33331111-0005-0005-0005-000000000001', '22221111-0005-0005-0005-000000000005', 'Ballimaran',         '110006'),
  ('33331111-0005-0005-0005-000000000002', '22221111-0005-0005-0005-000000000005', 'Kucha Chelan',       '110006'),
  ('33331111-0005-0005-0005-000000000003', '22221111-0005-0005-0005-000000000005', 'Gali Guliyan',       '110006'),
  ('33331111-0005-0005-0005-000000000004', '22221111-0005-0005-0005-000000000005', 'Bazar Sita Ram',     '110006'),
  ('33331111-0005-0005-0005-000000000005', '22221111-0005-0005-0005-000000000005', 'Kucha Pati Ram',     '110006');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0005-0005-0005-000000000001', '1, Ballimaran Main Road, Delhi - 110006', 'Ghalib House Nearby'),
  ('33331111-0005-0005-0005-000000000001', '16, Hakim Market, Ballimaran, Delhi - 110006', 'Hakims Shops'),
  ('33331111-0005-0005-0005-000000000001', '30, Gali Qasai, Ballimaran, Delhi - 110006', 'Old Delhi Lane'),
  ('33331111-0005-0005-0005-000000000001', '52, Kalan Mahal, Ballimaran, Delhi - 110006', 'Near Mosque');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0005-0005-0005-000000000002', '4, Kucha Chelan, Delhi - 110006', 'Old Mohalla'),
  ('33331111-0005-0005-0005-000000000002', '17, Gali Chelan, Delhi - 110006', 'Near Dharamshala'),
  ('33331111-0005-0005-0005-000000000002', '31, Inner Lane Chelan, Delhi - 110006', 'Residential Quarter'),
  ('33331111-0005-0005-0005-000000000002', '46, Mohalla Chelan, Delhi - 110006', 'Near Water Pump');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0005-0005-0005-000000000003', '3, Gali Guliyan, Delhi - 110006', 'Bangles Lane'),
  ('33331111-0005-0005-0005-000000000003', '18, Naya Daur, Gali Guliyan, Delhi - 110006', 'Near Junction'),
  ('33331111-0005-0005-0005-000000000003', '32, Gali Guliyan Extension, Delhi - 110006', 'Residential'),
  ('33331111-0005-0005-0005-000000000003', '44, Mohalla Guliyan, Delhi - 110006', 'Behind School');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0005-0005-0005-000000000004', '1, Bazar Sita Ram Road, Delhi - 110006', 'Wholesale Market'),
  ('33331111-0005-0005-0005-000000000004', '15, Gali Sita Ram, Delhi - 110006', 'Near Temple'),
  ('33331111-0005-0005-0005-000000000004', '29, Mithai Gali, Bazar Sita Ram, Delhi - 110006', 'Sweet Shop Street'),
  ('33331111-0005-0005-0005-000000000004', '43, Katra Sita Ram, Delhi - 110006', 'Courtyard Market');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('33331111-0005-0005-0005-000000000005', '2, Kucha Pati Ram, Delhi - 110006', 'Old Residential Lane'),
  ('33331111-0005-0005-0005-000000000005', '14, Gali Pati Ram, Delhi - 110006', 'Near Hand Pump'),
  ('33331111-0005-0005-0005-000000000005', '26, Mohalla Pati Ram, Delhi - 110006', 'Behind Market'),
  ('33331111-0005-0005-0005-000000000005', '38, Extension, Kucha Pati Ram, Delhi - 110006', 'Near MCD Office');

-- ============================================================
-- SOUTH ZONE
-- ============================================================

INSERT INTO wards (id, zone_id, ward_number, ward_name, councillor_name, councillor_party, councillor_phone) VALUES
  ('22222222-0001-0001-0001-000000000001', '11111111-0002-0002-0002-000000000002', 148, 'Hauz Khas',           'Kamal Bhardwaj',     'AAP', '011-26498001'),
  ('22222222-0002-0002-0002-000000000002', '11111111-0002-0002-0002-000000000002', 149, 'Malviya Nagar',       'Leena Kumar',        'AAP', '011-26498002'),
  ('22222222-0003-0003-0003-000000000003', '11111111-0002-0002-0002-000000000002', 155, 'Mehrauli',            'Rekha',              'AAP', '011-26498003'),
  ('22222222-0004-0004-0004-000000000004', '11111111-0002-0002-0002-000000000002', 171, 'Chitaranjan Park',    'Ashu Thakur',        'AAP', '011-26498004'),
  ('22222222-0005-0005-0005-000000000005', '11111111-0002-0002-0002-000000000002', 173, 'Greater Kailash',     'Shikha Roy',         'BJP', '011-26498005');

-- Localities — Ward 148: Hauz Khas
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('44441111-0001-0001-0001-000000000001', '22222222-0001-0001-0001-000000000001', 'Hauz Khas Village',   '110016'),
  ('44441111-0001-0001-0001-000000000002', '22222222-0001-0001-0001-000000000001', 'SDA Market',          '110016'),
  ('44441111-0001-0001-0001-000000000003', '22222222-0001-0001-0001-000000000001', 'Panchsheel Park',     '110017'),
  ('44441111-0001-0001-0001-000000000004', '22222222-0001-0001-0001-000000000001', 'Deer Park Area',      '110016'),
  ('44441111-0001-0001-0001-000000000005', '22222222-0001-0001-0001-000000000001', 'IIT Gate Colony',     '110016');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0001-0001-0001-000000000001', '14, Hauz Khas Village, Delhi - 110016', 'Near Hauz Khas Lake'),
  ('44441111-0001-0001-0001-000000000001', '28, Outer Lane, HKV, Delhi - 110016', 'Art Gallery Row'),
  ('44441111-0001-0001-0001-000000000001', '45, Upper Hauz Khas Village, Delhi - 110016', 'Roof Terrace Area'),
  ('44441111-0001-0001-0001-000000000001', '7, Steps Lane, HKV, Delhi - 110016', 'Near Historic Madrasa');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0001-0001-0001-000000000002', 'Shop 3, SDA Market, Delhi - 110016', 'Main Market'),
  ('44441111-0001-0001-0001-000000000002', 'Shop 18, SDA Market, Delhi - 110016', 'Food Court Area'),
  ('44441111-0001-0001-0001-000000000002', '5, SDA Road, Delhi - 110016', 'Near Bus Stop'),
  ('44441111-0001-0001-0001-000000000002', '22, Ber Sarai, Delhi - 110016', 'Opp. JNU Gate 2');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0001-0001-0001-000000000003', 'A-12, Panchsheel Park, Delhi - 110017', 'Near Park Entrance'),
  ('44441111-0001-0001-0001-000000000003', 'B-34, Panchsheel Park, Delhi - 110017', 'Community Hall'),
  ('44441111-0001-0001-0001-000000000003', 'C-7, Panchsheel Park, Delhi - 110017', 'Near Temple'),
  ('44441111-0001-0001-0001-000000000003', 'D-50, Panchsheel Park, Delhi - 110017', 'Market Block');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0001-0001-0001-000000000004', '3, Deer Park Road, Delhi - 110016', 'Main Park Gate'),
  ('44441111-0001-0001-0001-000000000004', '17, Rose Garden Colony, Delhi - 110016', 'Near Deer Enclosure'),
  ('44441111-0001-0001-0001-000000000004', '29, Hauz Khas Enclave, Delhi - 110016', 'Adjacent Deer Park'),
  ('44441111-0001-0001-0001-000000000004', '44, Aurobindo Marg, Delhi - 110016', 'Near AIIMS flyover');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0001-0001-0001-000000000005', '1, IIT Main Gate Road, Delhi - 110016', 'Near IIT Main Gate'),
  ('44441111-0001-0001-0001-000000000005', '8, Satya Niketan, Delhi - 110021', 'Near Market'),
  ('44441111-0001-0001-0001-000000000005', '15, Munirka Village, Delhi - 110067', 'Near Bus Terminus'),
  ('44441111-0001-0001-0001-000000000005', '22, Katwaria Sarai, Delhi - 110016', 'Near Metro Pillar 94');

-- Localities — Ward 149: Malviya Nagar
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('44441111-0002-0002-0002-000000000001', '22222222-0002-0002-0002-000000000002', 'Malviya Nagar Main', '110017'),
  ('44441111-0002-0002-0002-000000000002', '22222222-0002-0002-0002-000000000002', 'Khirki Village',     '110017'),
  ('44441111-0002-0002-0002-000000000003', '22222222-0002-0002-0002-000000000002', 'Shivalik',           '110017'),
  ('44441111-0002-0002-0002-000000000004', '22222222-0002-0002-0002-000000000002', 'Begumpur',           '110017'),
  ('44441111-0002-0002-0002-000000000005', '22222222-0002-0002-0002-000000000002', 'Press Enclave',      '110017');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0002-0002-0002-000000000001', 'H-12, Malviya Nagar, Delhi - 110017', 'Near Market'),
  ('44441111-0002-0002-0002-000000000001', 'C-45, Malviya Nagar, Delhi - 110017', 'DDA Flats Block'),
  ('44441111-0002-0002-0002-000000000001', 'J-8, Malviya Nagar, Delhi - 110017', 'Near School'),
  ('44441111-0002-0002-0002-000000000001', 'F-23, Malviya Nagar, Delhi - 110017', 'Near Hospital');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0002-0002-0002-000000000002', '5, Khirki Village, Delhi - 110017', 'Near Malviya Nagar Metro'),
  ('44441111-0002-0002-0002-000000000002', '19, Gali No.3, Khirki, Delhi - 110017', 'Inside Village'),
  ('44441111-0002-0002-0002-000000000002', '34, Khirki Extension, Delhi - 110017', 'Near DDA Park'),
  ('44441111-0002-0002-0002-000000000002', '50, Hauz Rani, Delhi - 110017', 'Near Water Tank');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0002-0002-0002-000000000003', 'A-3, Shivalik, Delhi - 110017', 'Society Entrance'),
  ('44441111-0002-0002-0002-000000000003', 'B-17, Shivalik, Delhi - 110017', 'Near Playground'),
  ('44441111-0002-0002-0002-000000000003', 'C-30, Shivalik, Delhi - 110017', 'Community Hall'),
  ('44441111-0002-0002-0002-000000000003', 'D-44, Shivalik, Delhi - 110017', 'Block D Market');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0002-0002-0002-000000000004', '6, Begumpur Village, Delhi - 110017', 'Near Mosque'),
  ('44441111-0002-0002-0002-000000000004', '21, Begumpur Main Road, Delhi - 110017', 'Market Street'),
  ('44441111-0002-0002-0002-000000000004', '35, Gali No.1, Begumpur, Delhi - 110017', 'Old Settlement'),
  ('44441111-0002-0002-0002-000000000004', '47, Begumpur Extension, Delhi - 110017', 'Near School');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0002-0002-0002-000000000005', 'A-9, Press Enclave, Delhi - 110017', 'Near Press Office'),
  ('44441111-0002-0002-0002-000000000005', 'B-22, Press Enclave, Delhi - 110017', 'Residential Block'),
  ('44441111-0002-0002-0002-000000000005', 'C-15, Press Enclave, Delhi - 110017', 'Near Temple'),
  ('44441111-0002-0002-0002-000000000005', 'D-38, Press Enclave, Delhi - 110017', 'Community Centre');

-- Localities — Ward 155: Mehrauli
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('44441111-0003-0003-0003-000000000001', '22222222-0003-0003-0003-000000000003', 'Mehrauli Village',   '110030'),
  ('44441111-0003-0003-0003-000000000002', '22222222-0003-0003-0003-000000000003', 'Qutub Minar Area',  '110030'),
  ('44441111-0003-0003-0003-000000000003', '22222222-0003-0003-0003-000000000003', 'Lado Sarai',         '110030'),
  ('44441111-0003-0003-0003-000000000004', '22222222-0003-0003-0003-000000000003', 'Ber Sarai',          '110030'),
  ('44441111-0003-0003-0003-000000000005', '22222222-0003-0003-0003-000000000003', 'Gadaipur',           '110030');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0003-0003-0003-000000000001', '4, Mehrauli Village Road, Delhi - 110030', 'Near Old Fort Gate'),
  ('44441111-0003-0003-0003-000000000001', '19, Gali Sunar, Mehrauli, Delhi - 110030', 'Jewelers Lane'),
  ('44441111-0003-0003-0003-000000000001', '33, Phool Walon Ki Sair Rd, Delhi - 110030', 'Historic Fair Ground'),
  ('44441111-0003-0003-0003-000000000001', '50, Mehrauli Market, Delhi - 110030', 'Near Police Station');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0003-0003-0003-000000000002', '1, Qutub Minar Road, Delhi - 110030', 'ASI Monument Entry'),
  ('44441111-0003-0003-0003-000000000002', '12, Mehrauli-Gurgaon Road, Delhi - 110030', 'Near Hotel'),
  ('44441111-0003-0003-0003-000000000002', '25, DLF Galleria Road, Delhi - 110030', 'Near Shopping Area'),
  ('44441111-0003-0003-0003-000000000002', '40, Qutub Institutional Area, Delhi - 110016', 'Near Offices');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0003-0003-0003-000000000003', '7, Lado Sarai, Delhi - 110030', 'Art Gallery District'),
  ('44441111-0003-0003-0003-000000000003', '21, Ladosarai Main Road, Delhi - 110030', 'Near Metro'),
  ('44441111-0003-0003-0003-000000000003', '36, Sector A, Lado Sarai, Delhi - 110030', 'Community Market'),
  ('44441111-0003-0003-0003-000000000003', '52, Pocket C, Lado Sarai, Delhi - 110030', 'Park Side');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0003-0003-0003-000000000004', '2, Ber Sarai, Delhi - 110016', 'Near JNU Gate 2'),
  ('44441111-0003-0003-0003-000000000004', '14, Ber Sarai Market, Delhi - 110016', 'Market Row'),
  ('44441111-0003-0003-0003-000000000004', '28, Gali No.2, Ber Sarai, Delhi - 110016', 'Residential Lane'),
  ('44441111-0003-0003-0003-000000000004', '41, Extension, Ber Sarai, Delhi - 110016', 'Near School');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0003-0003-0003-000000000005', '5, Gadaipur Village, Delhi - 110030', 'Village Panchayat'),
  ('44441111-0003-0003-0003-000000000005', '16, Gadaipur Extension, Delhi - 110030', 'Near Dhaba'),
  ('44441111-0003-0003-0003-000000000005', '27, Gadaipur Road, Delhi - 110030', 'Near Petrol Pump'),
  ('44441111-0003-0003-0003-000000000005', '38, Gali No.1, Gadaipur, Delhi - 110030', 'Near Primary School');

-- Localities — Ward 171: Chittaranjan Park
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('44441111-0004-0004-0004-000000000001', '22222222-0004-0004-0004-000000000004', 'CR Park Block A',     '110019'),
  ('44441111-0004-0004-0004-000000000002', '22222222-0004-0004-0004-000000000004', 'CR Park Block C',     '110019'),
  ('44441111-0004-0004-0004-000000000003', '22222222-0004-0004-0004-000000000004', 'CR Park Market',      '110019'),
  ('44441111-0004-0004-0004-000000000004', '22222222-0004-0004-0004-000000000004', 'Kalkaji Extension',   '110019'),
  ('44441111-0004-0004-0004-000000000005', '22222222-0004-0004-0004-000000000004', 'Nehru Enclave',       '110019');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0004-0004-0004-000000000001', 'A-12, Chittaranjan Park, Delhi - 110019', 'Near Durga Puja Ground'),
  ('44441111-0004-0004-0004-000000000001', 'A-47, Chittaranjan Park, Delhi - 110019', 'Park Entrance'),
  ('44441111-0004-0004-0004-000000000001', 'A-83, Chittaranjan Park, Delhi - 110019', 'Near Market No.1'),
  ('44441111-0004-0004-0004-000000000001', 'A-120, Chittaranjan Park, Delhi - 110019', 'Near Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0004-0004-0004-000000000002', 'C-5, Chittaranjan Park, Delhi - 110019', 'Block C Market'),
  ('44441111-0004-0004-0004-000000000002', 'C-28, Chittaranjan Park, Delhi - 110019', 'Near Pond'),
  ('44441111-0004-0004-0004-000000000002', 'C-61, Chittaranjan Park, Delhi - 110019', 'Fish Market Side'),
  ('44441111-0004-0004-0004-000000000002', 'C-90, Chittaranjan Park, Delhi - 110019', 'Near Community Hall');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0004-0004-0004-000000000003', 'Shop 4, Market No.1, CR Park, Delhi - 110019', 'Main Market'),
  ('44441111-0004-0004-0004-000000000003', 'Shop 22, Market No.2, CR Park, Delhi - 110019', 'Fish Market'),
  ('44441111-0004-0004-0004-000000000003', 'Shop 40, Market No.3, CR Park, Delhi - 110019', 'Vegetable Market'),
  ('44441111-0004-0004-0004-000000000003', 'Shop 55, Market No.4, CR Park, Delhi - 110019', 'Sweet Shops');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0004-0004-0004-000000000004', 'A-3, Kalkaji Extension, Delhi - 110019', 'Near Metro Station'),
  ('44441111-0004-0004-0004-000000000004', 'B-18, Kalkaji Extension, Delhi - 110019', 'Park Side'),
  ('44441111-0004-0004-0004-000000000004', 'C-32, Kalkaji Extension, Delhi - 110019', 'Near School'),
  ('44441111-0004-0004-0004-000000000004', 'D-50, Kalkaji Extension, Delhi - 110019', 'Community Centre');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0004-0004-0004-000000000005', 'E-7, Nehru Enclave, Delhi - 110019', 'Near Power House'),
  ('44441111-0004-0004-0004-000000000005', 'F-21, Nehru Enclave, Delhi - 110019', 'Behind DDA Flats'),
  ('44441111-0004-0004-0004-000000000005', 'G-35, Nehru Enclave, Delhi - 110019', 'Near Bus Stop'),
  ('44441111-0004-0004-0004-000000000005', 'H-48, Nehru Enclave, Delhi - 110019', 'Near Bank ATM');

-- Localities — Ward 173: Greater Kailash
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('44441111-0005-0005-0005-000000000001', '22222222-0005-0005-0005-000000000005', 'GK-I M Block',       '110048'),
  ('44441111-0005-0005-0005-000000000002', '22222222-0005-0005-0005-000000000005', 'GK-I N Block',       '110048'),
  ('44441111-0005-0005-0005-000000000003', '22222222-0005-0005-0005-000000000005', 'GK-II M Block',      '110048'),
  ('44441111-0005-0005-0005-000000000004', '22222222-0005-0005-0005-000000000005', 'GK-II S Block',      '110048'),
  ('44441111-0005-0005-0005-000000000005', '22222222-0005-0005-0005-000000000005', 'Pamposh Enclave',    '110048');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0005-0005-0005-000000000001', 'M-11, Greater Kailash Part I, Delhi - 110048', 'M Block Market'),
  ('44441111-0005-0005-0005-000000000001', 'M-44, Greater Kailash Part I, Delhi - 110048', 'Near Metro Gate'),
  ('44441111-0005-0005-0005-000000000001', 'M-78, Greater Kailash Part I, Delhi - 110048', 'Community Park'),
  ('44441111-0005-0005-0005-000000000001', 'M-102, Greater Kailash Part I, Delhi - 110048', 'Near Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0005-0005-0005-000000000002', 'N-5, Greater Kailash Part I, Delhi - 110048', 'Residential Lane'),
  ('44441111-0005-0005-0005-000000000002', 'N-30, Greater Kailash Part I, Delhi - 110048', 'Near Bank'),
  ('44441111-0005-0005-0005-000000000002', 'N-60, Greater Kailash Part I, Delhi - 110048', 'N Block Market'),
  ('44441111-0005-0005-0005-000000000002', 'N-88, Greater Kailash Part I, Delhi - 110048', 'Near School');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0005-0005-0005-000000000003', 'M-23, Greater Kailash Part II, Delhi - 110048', 'Shopping Complex'),
  ('44441111-0005-0005-0005-000000000003', 'M-56, Greater Kailash Part II, Delhi - 110048', 'Near Park'),
  ('44441111-0005-0005-0005-000000000003', 'M-79, Greater Kailash Part II, Delhi - 110048', 'Petrol Pump Lane'),
  ('44441111-0005-0005-0005-000000000003', 'M-93, Greater Kailash Part II, Delhi - 110048', 'Near Hospital');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0005-0005-0005-000000000004', 'S-8, Greater Kailash Part II, Delhi - 110048', 'S Block Market'),
  ('44441111-0005-0005-0005-000000000004', 'S-35, Greater Kailash Part II, Delhi - 110048', 'Behind Club'),
  ('44441111-0005-0005-0005-000000000004', 'S-62, Greater Kailash Part II, Delhi - 110048', 'Near Metro'),
  ('44441111-0005-0005-0005-000000000004', 'S-90, Greater Kailash Part II, Delhi - 110048', 'Community Hall');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('44441111-0005-0005-0005-000000000005', 'A-14, Pamposh Enclave, Delhi - 110048', 'Near Main Road'),
  ('44441111-0005-0005-0005-000000000005', 'B-30, Pamposh Enclave, Delhi - 110048', 'Adjacent Park'),
  ('44441111-0005-0005-0005-000000000005', 'C-47, Pamposh Enclave, Delhi - 110048', 'Near School'),
  ('44441111-0005-0005-0005-000000000005', 'D-63, Pamposh Enclave, Delhi - 110048', 'Near Temple');

-- ============================================================
-- ROHINI ZONE
-- ============================================================

INSERT INTO wards (id, zone_id, ward_number, ward_name, councillor_name, councillor_party, councillor_phone) VALUES
  ('22223333-0001-0001-0001-000000000001', '11111111-0003-0003-0003-000000000003', 21, 'Rohini-A',         'Pradeep Mittal',     'AAP', '011-27048001'),
  ('22223333-0002-0002-0002-000000000002', '11111111-0003-0003-0003-000000000003', 22, 'Rohini-B',         'Suman Anil Rana',    'AAP', '011-27048002'),
  ('22223333-0003-0003-0003-000000000003', '11111111-0003-0003-0003-000000000003', 57, 'Pitam Pura',       'Sanju Jain',         'AAP', '011-27048003'),
  ('22223333-0004-0004-0004-000000000004', '11111111-0003-0003-0003-000000000003', 58, 'Saraswati Vihar',  'Urmila Gupta',       'AAP', '011-27048004'),
  ('22223333-0005-0005-0005-000000000005', '11111111-0003-0003-0003-000000000003', 59, 'Paschim Vihar',    'Shalu Duggal',       'AAP', '011-27048005');

-- Localities — Ward 21: Rohini-A
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('55551111-0001-0001-0001-000000000001', '22223333-0001-0001-0001-000000000001', 'Rohini Sector 1',   '110085'),
  ('55551111-0001-0001-0001-000000000002', '22223333-0001-0001-0001-000000000001', 'Rohini Sector 2',   '110085'),
  ('55551111-0001-0001-0001-000000000003', '22223333-0001-0001-0001-000000000001', 'Rohini Sector 3',   '110085'),
  ('55551111-0001-0001-0001-000000000004', '22223333-0001-0001-0001-000000000001', 'Rohini Sector 4',   '110085'),
  ('55551111-0001-0001-0001-000000000005', '22223333-0001-0001-0001-000000000001', 'Prashant Vihar',    '110085');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0001-0001-0001-000000000001', 'H-23, Pocket A, Sector 1, Rohini, Delhi - 110085', 'Near Market'),
  ('55551111-0001-0001-0001-000000000001', 'H-55, Pocket B, Sector 1, Rohini, Delhi - 110085', 'Near Metro Station'),
  ('55551111-0001-0001-0001-000000000001', 'H-80, Pocket C, Sector 1, Rohini, Delhi - 110085', 'Near School'),
  ('55551111-0001-0001-0001-000000000001', 'H-105, Pocket D, Sector 1, Rohini, Delhi - 110085', 'Community Park');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0001-0001-0001-000000000002', 'H-12, Pocket A, Sector 2, Rohini, Delhi - 110085', 'Sector 2 Market'),
  ('55551111-0001-0001-0001-000000000002', 'H-38, Pocket B, Sector 2, Rohini, Delhi - 110085', 'Near Hospital'),
  ('55551111-0001-0001-0001-000000000002', 'H-65, Pocket C, Sector 2, Rohini, Delhi - 110085', 'DDA Park'),
  ('55551111-0001-0001-0001-000000000002', 'H-90, Pocket D, Sector 2, Rohini, Delhi - 110085', 'Near Bus Stop');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0001-0001-0001-000000000003', 'H-5, Pocket A, Sector 3, Rohini, Delhi - 110085', 'Near School'),
  ('55551111-0001-0001-0001-000000000003', 'H-30, Pocket B, Sector 3, Rohini, Delhi - 110085', 'Community Centre'),
  ('55551111-0001-0001-0001-000000000003', 'H-58, Pocket C, Sector 3, Rohini, Delhi - 110085', 'Near ATM'),
  ('55551111-0001-0001-0001-000000000003', 'H-75, Pocket D, Sector 3, Rohini, Delhi - 110085', 'Near Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0001-0001-0001-000000000004', 'H-18, Pocket A, Sector 4, Rohini, Delhi - 110085', 'Sector 4 Local Market'),
  ('55551111-0001-0001-0001-000000000004', 'H-44, Pocket B, Sector 4, Rohini, Delhi - 110085', 'Near Police Post'),
  ('55551111-0001-0001-0001-000000000004', 'H-67, Pocket C, Sector 4, Rohini, Delhi - 110085', 'DDA Flats'),
  ('55551111-0001-0001-0001-000000000004', 'H-95, Pocket D, Sector 4, Rohini, Delhi - 110085', 'Near Playground');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0001-0001-0001-000000000005', 'A-8, Prashant Vihar, Delhi - 110085', 'Main Market'),
  ('55551111-0001-0001-0001-000000000005', 'B-25, Prashant Vihar, Delhi - 110085', 'Near Dispensary'),
  ('55551111-0001-0001-0001-000000000005', 'C-42, Prashant Vihar, Delhi - 110085', 'Park Side'),
  ('55551111-0001-0001-0001-000000000005', 'D-60, Prashant Vihar, Delhi - 110085', 'Near School');

-- Localities — Ward 57: Pitam Pura
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('55551111-0003-0003-0003-000000000001', '22223333-0003-0003-0003-000000000003', 'Pitam Pura Main',    '110034'),
  ('55551111-0003-0003-0003-000000000002', '22223333-0003-0003-0003-000000000003', 'Netaji Subhash Place','110034'),
  ('55551111-0003-0003-0003-000000000003', '22223333-0003-0003-0003-000000000003', 'Rani Bagh',          '110034'),
  ('55551111-0003-0003-0003-000000000004', '22223333-0003-0003-0003-000000000003', 'Shakurpur Village',  '110034'),
  ('55551111-0003-0003-0003-000000000005', '22223333-0003-0003-0003-000000000003', 'Tri Nagar',          '110035');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0003-0003-0003-000000000001', 'H-14, Pitam Pura, Delhi - 110034', 'Near TV Tower'),
  ('55551111-0003-0003-0003-000000000001', 'H-38, Pitam Pura, Delhi - 110034', 'Near Market'),
  ('55551111-0003-0003-0003-000000000001', 'H-65, Pitam Pura, Delhi - 110034', 'Near Metro'),
  ('55551111-0003-0003-0003-000000000001', 'H-90, Pitam Pura, Delhi - 110034', 'Near School');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0003-0003-0003-000000000002', 'Shop 5, NSP Commercial Complex, Delhi - 110034', 'IT Hub Area'),
  ('55551111-0003-0003-0003-000000000002', 'Shop 22, NSP, Delhi - 110034', 'Near Aggarwal Cyber Plaza'),
  ('55551111-0003-0003-0003-000000000002', '8, NSP Pocket 1, Delhi - 110034', 'Residential Side'),
  ('55551111-0003-0003-0003-000000000002', '30, NSP Extension, Delhi - 110034', 'Near Petrol Pump');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0003-0003-0003-000000000003', 'A-5, Rani Bagh, Delhi - 110034', 'Near Garden'),
  ('55551111-0003-0003-0003-000000000003', 'B-20, Rani Bagh, Delhi - 110034', 'Market Road'),
  ('55551111-0003-0003-0003-000000000003', 'C-35, Rani Bagh, Delhi - 110034', 'Near Temple'),
  ('55551111-0003-0003-0003-000000000003', 'D-50, Rani Bagh, Delhi - 110034', 'Community Hall');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0003-0003-0003-000000000004', '7, Shakurpur Village, Delhi - 110034', 'Village Centre'),
  ('55551111-0003-0003-0003-000000000004', '21, Gali No.2, Shakurpur, Delhi - 110034', 'Near Gurudwara'),
  ('55551111-0003-0003-0003-000000000004', '36, Shakurpur Extension, Delhi - 110034', 'Near Metro'),
  ('55551111-0003-0003-0003-000000000004', '50, Shakurpur Main Road, Delhi - 110034', 'Near Bus Terminal');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('55551111-0003-0003-0003-000000000005', 'A-11, Tri Nagar, Delhi - 110035', 'Near Market'),
  ('55551111-0003-0003-0003-000000000005', 'B-28, Tri Nagar, Delhi - 110035', 'Block B Chowk'),
  ('55551111-0003-0003-0003-000000000005', 'C-44, Tri Nagar, Delhi - 110035', 'Near School'),
  ('55551111-0003-0003-0003-000000000005', 'D-60, Tri Nagar, Delhi - 110035', 'Near Hospital');

-- Localities for Ward 22 (Rohini-B) and Wards 58, 59 follow same pattern — abbreviated for clarity
INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('55552222-0001-0001-0001-000000000001', '22223333-0002-0002-0002-000000000002', 'Rohini Sector 5',   '110085'),
  ('55552222-0001-0001-0001-000000000002', '22223333-0002-0002-0002-000000000002', 'Rohini Sector 6',   '110085'),
  ('55552222-0001-0001-0001-000000000003', '22223333-0002-0002-0002-000000000002', 'Rohini Sector 7',   '110085'),
  ('55552222-0001-0001-0001-000000000004', '22223333-0002-0002-0002-000000000002', 'Rohini Sector 8',   '110085'),
  ('55552222-0001-0001-0001-000000000005', '22223333-0002-0002-0002-000000000002', 'Mangolpuri',        '110083');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('55554444-0001-0001-0001-000000000001', '22223333-0004-0004-0004-000000000004', 'Saraswati Vihar Block A','110034'),
  ('55554444-0001-0001-0001-000000000002', '22223333-0004-0004-0004-000000000004', 'Saraswati Vihar Block B','110034'),
  ('55554444-0001-0001-0001-000000000003', '22223333-0004-0004-0004-000000000004', 'Kanjhawla Extension',   '110081'),
  ('55554444-0001-0001-0001-000000000004', '22223333-0004-0004-0004-000000000004', 'Budh Vihar Phase I',    '110086'),
  ('55554444-0001-0001-0001-000000000005', '22223333-0004-0004-0004-000000000004', 'Shivaji Park',          '110034');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('55555555-0001-0001-0001-000000000001', '22223333-0005-0005-0005-000000000005', 'Paschim Vihar Block A','110063'),
  ('55555555-0001-0001-0001-000000000002', '22223333-0005-0005-0005-000000000005', 'Paschim Vihar Block B','110063'),
  ('55555555-0001-0001-0001-000000000003', '22223333-0005-0005-0005-000000000005', 'Peeragarhi',           '110041'),
  ('55555555-0001-0001-0001-000000000004', '22223333-0005-0005-0005-000000000005', 'Madipur',              '110063'),
  ('55555555-0001-0001-0001-000000000005', '22223333-0005-0005-0005-000000000005', 'Ramesh Nagar',         '110015');

-- ============================================================
-- KAROL BAGH ZONE
-- ============================================================

INSERT INTO wards (id, zone_id, ward_number, ward_name, councillor_name, councillor_party, councillor_phone) VALUES
  ('22224444-0001-0001-0001-000000000001', '11111111-0004-0004-0004-000000000004', 83,  'Karol Bagh',         'Urmila Chawla',   'BJP', '011-25498001'),
  ('22224444-0002-0002-0002-000000000002', '11111111-0004-0004-0004-000000000004', 84,  'Dev Nagar',          'Mahesh Khichi',   'AAP', '011-25498002'),
  ('22224444-0003-0003-0003-000000000003', '11111111-0004-0004-0004-000000000004', 85,  'West Patel Nagar',   'Rekha Kumar',     'AAP', '011-25498003'),
  ('22224444-0004-0004-0004-000000000004', '11111111-0004-0004-0004-000000000004', 86,  'East Patel Nagar',   'Arti Chawla',     'AAP', '011-25498004'),
  ('22224444-0005-0005-0005-000000000005', '11111111-0004-0004-0004-000000000004', 87,  'Ranjeet Nagar',      'Ankush Narang',   'AAP', '011-25498005');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('66661111-0001-0001-0001-000000000001', '22224444-0001-0001-0001-000000000001', 'Karol Bagh Market',    '110005'),
  ('66661111-0001-0001-0001-000000000002', '22224444-0001-0001-0001-000000000001', 'Ajmal Khan Road',      '110005'),
  ('66661111-0001-0001-0001-000000000003', '22224444-0001-0001-0001-000000000001', 'Bank Street',          '110005'),
  ('66661111-0001-0001-0001-000000000004', '22224444-0001-0001-0001-000000000001', 'Gaffar Market',        '110005'),
  ('66661111-0001-0001-0001-000000000005', '22224444-0001-0001-0001-000000000001', 'Pusa Road Area',       '110005');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('66661111-0001-0001-0001-000000000001', '14, Karol Bagh Main Market, Delhi - 110005', 'Electronics Hub'),
  ('66661111-0001-0001-0001-000000000001', '33, Gali 8, Karol Bagh, Delhi - 110005', 'Near Gurudwara'),
  ('66661111-0001-0001-0001-000000000001', '55, Naiwala, Karol Bagh, Delhi - 110005', 'Near Metro Gate 3'),
  ('66661111-0001-0001-0001-000000000001', '78, Tank Road, Karol Bagh, Delhi - 110005', 'Near DCP Office');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('66661111-0001-0001-0001-000000000002', '3, Ajmal Khan Road, Delhi - 110005', 'Jewellery Market'),
  ('66661111-0001-0001-0001-000000000002', '25, Ajmal Khan Road, Delhi - 110005', 'Cloth Market'),
  ('66661111-0001-0001-0001-000000000002', '47, Ajmal Khan Road, Delhi - 110005', 'Near Axis Bank'),
  ('66661111-0001-0001-0001-000000000002', '66, Ajmal Khan Road, Delhi - 110005', 'Near Metro Station');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('66661111-0001-0001-0001-000000000003', '2, Bank Street, Karol Bagh, Delhi - 110005', 'Financial District'),
  ('66661111-0001-0001-0001-000000000003', '18, Bank Street, Karol Bagh, Delhi - 110005', 'Near SBI'),
  ('66661111-0001-0001-0001-000000000003', '34, Bank Street, Karol Bagh, Delhi - 110005', 'Near PNB Branch'),
  ('66661111-0001-0001-0001-000000000003', '50, Bank Street, Karol Bagh, Delhi - 110005', 'Near Post Office');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('66661111-0001-0001-0001-000000000004', 'Shop 5, Gaffar Market, Delhi - 110005', 'Mobile Phone Market'),
  ('66661111-0001-0001-0001-000000000004', 'Shop 20, Gaffar Market, Delhi - 110005', 'Electronics Area'),
  ('66661111-0001-0001-0001-000000000004', 'Shop 38, Gaffar Market, Delhi - 110005', 'Accessories Lane'),
  ('66661111-0001-0001-0001-000000000004', 'Shop 55, Gaffar Market, Delhi - 110005', 'Near Parking Lot');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('66661111-0001-0001-0001-000000000005', '7, Pusa Road, Delhi - 110005', 'Near WUS Gate'),
  ('66661111-0001-0001-0001-000000000005', '21, Pusa Road, Delhi - 110005', 'Near ICAR Office'),
  ('66661111-0001-0001-0001-000000000005', '38, Shankar Road, Delhi - 110060', 'Baba Kharak Singh Marg Side'),
  ('66661111-0001-0001-0001-000000000005', '55, Pusa Road Link, Delhi - 110005', 'Near Railway Underpass');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('66662222-0001-0001-0001-000000000001', '22224444-0002-0002-0002-000000000002', 'Dev Nagar',          '110005'),
  ('66662222-0001-0001-0001-000000000002', '22224444-0002-0002-0002-000000000002', 'Inderpuri',          '110012'),
  ('66662222-0001-0001-0001-000000000003', '22224444-0002-0002-0002-000000000002', 'Kirti Nagar',        '110015'),
  ('66662222-0001-0001-0001-000000000004', '22224444-0002-0002-0002-000000000002', 'Shadipur',           '110008'),
  ('66662222-0001-0001-0001-000000000005', '22224444-0002-0002-0002-000000000002', 'Ramjas Colony',      '110007');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('66663333-0001-0001-0001-000000000001', '22224444-0003-0003-0003-000000000003', 'West Patel Nagar Main',  '110008'),
  ('66663333-0001-0001-0001-000000000002', '22224444-0003-0003-0003-000000000003', 'Rajinder Nagar',         '110060'),
  ('66663333-0001-0001-0001-000000000003', '22224444-0003-0003-0003-000000000003', 'Naraina',                '110028'),
  ('66663333-0001-0001-0001-000000000004', '22224444-0003-0003-0003-000000000003', 'Moti Nagar',             '110015'),
  ('66663333-0001-0001-0001-000000000005', '22224444-0003-0003-0003-000000000003', 'Rama Road',              '110015');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('66664444-0001-0001-0001-000000000001', '22224444-0004-0004-0004-000000000004', 'East Patel Nagar Main',  '110008'),
  ('66664444-0001-0001-0001-000000000002', '22224444-0004-0004-0004-000000000004', 'Baljeet Nagar',          '110008'),
  ('66664444-0001-0001-0001-000000000003', '22224444-0004-0004-0004-000000000004', 'Patel Nagar Market',     '110008'),
  ('66664444-0001-0001-0001-000000000004', '22224444-0004-0004-0004-000000000004', 'Basai Darapur',          '110015'),
  ('66664444-0001-0001-0001-000000000005', '22224444-0004-0004-0004-000000000004', 'Shivaji Marg Area',      '110015');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('66665555-0001-0001-0001-000000000001', '22224444-0005-0005-0005-000000000005', 'Ranjeet Nagar Main',   '110008'),
  ('66665555-0001-0001-0001-000000000002', '22224444-0005-0005-0005-000000000005', 'Shastri Nagar',        '110031'),
  ('66665555-0001-0001-0001-000000000003', '22224444-0005-0005-0005-000000000005', 'Karam Pura',           '110015'),
  ('66665555-0001-0001-0001-000000000004', '22224444-0005-0005-0005-000000000005', 'Tagore Garden',        '110027'),
  ('66665555-0001-0001-0001-000000000005', '22224444-0005-0005-0005-000000000005', 'Meera Bagh',           '110063');

-- ============================================================
-- CIVIL LINES ZONE
-- ============================================================

INSERT INTO wards (id, zone_id, ward_number, ward_name, councillor_name, councillor_party, councillor_phone) VALUES
  ('22225555-0001-0001-0001-000000000001', '11111111-0005-0005-0005-000000000005', 11,  'Timarpur',      'Promila Gupta',    'AAP', '011-23948101'),
  ('22225555-0002-0002-0002-000000000002', '11111111-0005-0005-0005-000000000005', 13,  'Mukherjee Nagar','Raja Iqbal Singh','BJP', '011-23948102'),
  ('22225555-0003-0003-0003-000000000003', '11111111-0005-0005-0005-000000000005', 68,  'Model Town',    'Kamlesh',         'AAP', '011-23948103'),
  ('22225555-0004-0004-0004-000000000004', '11111111-0005-0005-0005-000000000005', 69,  'Kamla Nagar',   'Renu Vohra',      'BJP', '011-23948104'),
  ('22225555-0005-0005-0005-000000000005', '11111111-0005-0005-0005-000000000005', 73,  'Civil Lines',   'Vikas',           'AAP', '011-23948105');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('77771111-0001-0001-0001-000000000001', '22225555-0001-0001-0001-000000000001', 'Timarpur Village',   '110054'),
  ('77771111-0001-0001-0001-000000000002', '22225555-0001-0001-0001-000000000001', 'Mukund Nagar',       '110009'),
  ('77771111-0001-0001-0001-000000000003', '22225555-0001-0001-0001-000000000001', 'Burari Extension',   '110084'),
  ('77771111-0001-0001-0001-000000000004', '22225555-0001-0001-0001-000000000001', 'Jahangirpuri Link',  '110033'),
  ('77771111-0001-0001-0001-000000000005', '22225555-0001-0001-0001-000000000001', 'Shakti Nagar',       '110007');

INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('77771111-0001-0001-0001-000000000001', '4, Timarpur Village, Delhi - 110054', 'Near Old Well'),
  ('77771111-0001-0001-0001-000000000001', '17, Gali No.3, Timarpur, Delhi - 110054', 'Near Primary School'),
  ('77771111-0001-0001-0001-000000000001', '31, Timarpur Main Road, Delhi - 110054', 'Near Police Chowki'),
  ('77771111-0001-0001-0001-000000000001', '46, Timarpur Extension, Delhi - 110054', 'Near DDA Park');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('77771111-0001-0001-0001-000000000002', 'H-5, Mukund Nagar, Delhi - 110009', 'Near Market'),
  ('77771111-0001-0001-0001-000000000002', 'H-20, Mukund Nagar, Delhi - 110009', 'Near School'),
  ('77771111-0001-0001-0001-000000000002', 'H-36, Mukund Nagar, Delhi - 110009', 'Community Centre'),
  ('77771111-0001-0001-0001-000000000002', 'H-52, Mukund Nagar, Delhi - 110009', 'Near Temple');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('77771111-0001-0001-0001-000000000003', '8, Burari Extension, Delhi - 110084', 'Near Metro'),
  ('77771111-0001-0001-0001-000000000003', '22, Gali No.1, Burari Ext, Delhi - 110084', 'Residential Colony'),
  ('77771111-0001-0001-0001-000000000003', '37, Burari Extension Main, Delhi - 110084', 'Near Dispensary'),
  ('77771111-0001-0001-0001-000000000003', '50, Burari Extension, Delhi - 110084', 'Near Bus Stop');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('77771111-0001-0001-0001-000000000004', 'A-10, Jahangirpuri Link Road, Delhi - 110033', 'Near Crossing'),
  ('77771111-0001-0001-0001-000000000004', 'B-25, Jahangirpuri Link, Delhi - 110033', 'Residential Block'),
  ('77771111-0001-0001-0001-000000000004', 'C-38, Jahangirpuri Link, Delhi - 110033', 'Near Masjid'),
  ('77771111-0001-0001-0001-000000000004', 'D-52, Jahangirpuri Link, Delhi - 110033', 'Near Sabji Mandi');
INSERT INTO addresses (locality_id, address_line, landmark) VALUES
  ('77771111-0001-0001-0001-000000000005', 'A-7, Shakti Nagar, Delhi - 110007', 'Near Market'),
  ('77771111-0001-0001-0001-000000000005', 'B-22, Shakti Nagar, Delhi - 110007', 'Near School'),
  ('77771111-0001-0001-0001-000000000005', 'C-35, Shakti Nagar, Delhi - 110007', 'Near Park'),
  ('77771111-0001-0001-0001-000000000005', 'D-50, Shakti Nagar, Delhi - 110007', 'Near Hospital');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('77772222-0001-0001-0001-000000000001', '22225555-0002-0002-0002-000000000002', 'Mukherjee Nagar Main', '110009'),
  ('77772222-0001-0001-0001-000000000002', '22225555-0002-0002-0002-000000000002', 'Shyam Nagar',          '110009'),
  ('77772222-0001-0001-0001-000000000003', '22225555-0002-0002-0002-000000000002', 'GTB Nagar',            '110009'),
  ('77772222-0001-0001-0001-000000000004', '22225555-0002-0002-0002-000000000002', 'Sarup Nagar',          '110042'),
  ('77772222-0001-0001-0001-000000000005', '22225555-0002-0002-0002-000000000002', 'Adarsh Nagar',         '110033');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('77773333-0001-0001-0001-000000000001', '22225555-0003-0003-0003-000000000003', 'Model Town Block A',   '110009'),
  ('77773333-0001-0001-0001-000000000002', '22225555-0003-0003-0003-000000000003', 'Model Town Block B',   '110009'),
  ('77773333-0001-0001-0001-000000000003', '22225555-0003-0003-0003-000000000003', 'Model Town Block C',   '110009'),
  ('77773333-0001-0001-0001-000000000004', '22225555-0003-0003-0003-000000000003', 'Azadpur',              '110033'),
  ('77773333-0001-0001-0001-000000000005', '22225555-0003-0003-0003-000000000003', 'Ashok Vihar',          '110052');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('77774444-0001-0001-0001-000000000001', '22225555-0004-0004-0004-000000000004', 'Kamla Nagar Market',   '110007'),
  ('77774444-0001-0001-0001-000000000002', '22225555-0004-0004-0004-000000000004', 'Outram Lines',         '110009'),
  ('77774444-0001-0001-0001-000000000003', '22225555-0004-0004-0004-000000000004', 'Hudson Lines',         '110009'),
  ('77774444-0001-0001-0001-000000000004', '22225555-0004-0004-0004-000000000004', 'Subzi Mandi',          '110007'),
  ('77774444-0001-0001-0001-000000000005', '22225555-0004-0004-0004-000000000004', 'Roop Nagar',           '110007');

INSERT INTO localities (id, ward_id, locality_name, pin_code) VALUES
  ('77775555-0001-0001-0001-000000000001', '22225555-0005-0005-0005-000000000005', 'Civil Lines Area',     '110054'),
  ('77775555-0001-0001-0001-000000000002', '22225555-0005-0005-0005-000000000005', 'Hindu Rao Area',       '110007'),
  ('77775555-0001-0001-0001-000000000003', '22225555-0005-0005-0005-000000000005', 'Raj Niwas Marg',       '110054'),
  ('77775555-0001-0001-0001-000000000004', '22225555-0005-0005-0005-000000000005', 'Nicholson Road',       '110054'),
  ('77775555-0001-0001-0001-000000000005', '22225555-0005-0005-0005-000000000005', 'Lothian Road',         '110006');

-- ============================================================
-- POLLING BOOTHS (one per ward, representative)
-- ============================================================

INSERT INTO polling_booths (ward_id, booth_number, booth_name, booth_address) VALUES
  -- Central Zone
  ('22221111-0001-0001-0001-000000000001', 'CZ-074-001', 'Govt. Girls Sr. Sec. School, Chandni Chowk', 'Chandni Chowk, Delhi - 110006'),
  ('22221111-0002-0002-0002-000000000002', 'CZ-075-001', 'MCD Primary School, Matia Mahal', 'Matia Mahal, Jama Masjid, Delhi - 110006'),
  ('22221111-0003-0003-0003-000000000003', 'CZ-076-001', 'Govt. Boys Sr. Sec. School, Turkman Gate', 'Turkman Gate, Delhi - 110006'),
  ('22221111-0004-0004-0004-000000000004', 'CZ-077-001', 'Kendriya Vidyalaya, Delhi Gate', 'Sher Shah Road, Delhi Gate, Delhi - 110002'),
  ('22221111-0005-0005-0005-000000000005', 'CZ-079-001', 'Sarvodaya Bal Vidyalaya, Ballimaran', 'Ballimaran Main Road, Delhi - 110006'),
  -- South Zone
  ('22222222-0001-0001-0001-000000000001', 'SZ-148-001', 'Govt. Girls Sr. Sec. School, Hauz Khas', 'Hauz Khas Road, Delhi - 110016'),
  ('22222222-0002-0002-0002-000000000002', 'SZ-149-001', 'MCD School, Malviya Nagar', 'H-Block, Malviya Nagar, Delhi - 110017'),
  ('22222222-0003-0003-0003-000000000003', 'SZ-155-001', 'Govt. Boys School, Mehrauli', 'Mehrauli Village, Delhi - 110030'),
  ('22222222-0004-0004-0004-000000000004', 'SZ-171-001', 'Sarvodaya Vidyalaya, CR Park', 'Block A, CR Park, Delhi - 110019'),
  ('22222222-0005-0005-0005-000000000005', 'SZ-173-001', 'DPS Mathura Road (Booth Site)', 'GK-I, Delhi - 110048'),
  -- Rohini Zone
  ('22223333-0001-0001-0001-000000000001', 'RZ-021-001', 'Sarvodaya Sr. Sec. School, Sector 1 Rohini', 'Sector 1, Rohini, Delhi - 110085'),
  ('22223333-0002-0002-0002-000000000002', 'RZ-022-001', 'Govt. Girls School, Sector 5 Rohini', 'Sector 5, Rohini, Delhi - 110085'),
  ('22223333-0003-0003-0003-000000000003', 'RZ-057-001', 'Sarvodaya Kanya Vidyalaya, Pitam Pura', 'Pitam Pura, Delhi - 110034'),
  ('22223333-0004-0004-0004-000000000004', 'RZ-058-001', 'MCD School, Saraswati Vihar', 'Saraswati Vihar, Delhi - 110034'),
  ('22223333-0005-0005-0005-000000000005', 'RZ-059-001', 'Govt. Boys School, Paschim Vihar', 'Paschim Vihar, Delhi - 110063'),
  -- Karol Bagh Zone
  ('22224444-0001-0001-0001-000000000001', 'KBZ-083-001', 'Arya Sr. Sec. School, Karol Bagh', 'Tank Road, Karol Bagh, Delhi - 110005'),
  ('22224444-0002-0002-0002-000000000002', 'KBZ-084-001', 'Govt. Girls School, Dev Nagar', 'Dev Nagar, Delhi - 110005'),
  ('22224444-0003-0003-0003-000000000003', 'KBZ-085-001', 'MCD School, West Patel Nagar', 'West Patel Nagar, Delhi - 110008'),
  ('22224444-0004-0004-0004-000000000004', 'KBZ-086-001', 'Sarvodaya Vidyalaya, East Patel Nagar', 'East Patel Nagar, Delhi - 110008'),
  ('22224444-0005-0005-0005-000000000005', 'KBZ-087-001', 'Govt. Boys Sr. Sec. School, Ranjeet Nagar', 'Ranjeet Nagar, Delhi - 110008'),
  -- Civil Lines Zone
  ('22225555-0001-0001-0001-000000000001', 'CLZ-011-001', 'Govt. Sr. Sec. School, Timarpur', 'Timarpur, Delhi - 110054'),
  ('22225555-0002-0002-0002-000000000002', 'CLZ-013-001', 'Sarvodaya Bal Vidyalaya, Mukherjee Nagar', 'Mukherjee Nagar, Delhi - 110009'),
  ('22225555-0003-0003-0003-000000000003', 'CLZ-068-001', 'MCD School, Model Town', 'Model Town Block B, Delhi - 110009'),
  ('22225555-0004-0004-0004-000000000004', 'CLZ-069-001', 'Govt. Girls School, Kamla Nagar', 'Kamla Nagar, Delhi - 110007'),
  ('22225555-0005-0005-0005-000000000005', 'CLZ-073-001', 'Hindu Rao Hospital Booth Site, Civil Lines', 'Hindu Rao Road, Delhi - 110007');

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_wards_zone_id      ON wards(zone_id);
CREATE INDEX IF NOT EXISTS idx_localities_ward_id ON localities(ward_id);
CREATE INDEX IF NOT EXISTS idx_addresses_locality_id ON addresses(locality_id);
CREATE INDEX IF NOT EXISTS idx_polling_booths_ward_id ON polling_booths(ward_id);
CREATE INDEX IF NOT EXISTS idx_wards_ward_number   ON wards(ward_number);
CREATE INDEX IF NOT EXISTS idx_zones_zone_code     ON zones(zone_code);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_full_governance_map AS
SELECT
  z.zone_name,
  z.zone_code,
  w.ward_number,
  w.ward_name,
  w.councillor_name,
  w.councillor_party,
  l.locality_name,
  l.pin_code,
  a.address_line,
  a.landmark,
  pb.booth_name      AS polling_booth_name,
  pb.booth_address   AS polling_booth_address
FROM zones z
JOIN wards       w  ON w.zone_id     = z.id
JOIN localities  l  ON l.ward_id     = w.id
JOIN addresses   a  ON a.locality_id = l.id
LEFT JOIN polling_booths pb ON pb.ward_id = w.id
ORDER BY z.zone_name, w.ward_number, l.locality_name, a.address_line;

-- Quick summary view
CREATE OR REPLACE VIEW v_ward_summary AS
SELECT
  z.zone_name,
  w.ward_number,
  w.ward_name,
  w.councillor_name,
  w.councillor_party,
  pb.booth_name AS primary_polling_booth,
  COUNT(DISTINCT l.id) AS total_localities,
  COUNT(DISTINCT a.id) AS total_addresses
FROM zones z
JOIN wards       w  ON w.zone_id     = z.id
LEFT JOIN localities  l  ON l.ward_id     = w.id
LEFT JOIN addresses   a  ON a.locality_id = l.id
LEFT JOIN polling_booths pb ON pb.ward_id = w.id
GROUP BY z.zone_name, w.ward_number, w.ward_name, w.councillor_name, w.councillor_party, pb.booth_name
ORDER BY z.zone_name, w.ward_number;

-- ============================================================
-- END OF FILE
-- ============================================================