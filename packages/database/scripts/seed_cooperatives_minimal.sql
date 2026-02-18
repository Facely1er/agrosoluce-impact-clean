-- Minimal seed: insert a few cooperatives only when the table is empty.
-- Use this only if you have no cooperatives; if you already have data, run bootstrap_enrichment.sql instead.
-- Run in Supabase SQL Editor after migrations 001 and 011 (or ALL_MIGRATIONS).
-- Safe to run multiple times: only inserts if no cooperatives exist.

INSERT INTO agrosoluce.cooperatives (
    name,
    region,
    department,
    sector,
    email,
    phone,
    description,
    is_verified
)
SELECT * FROM (VALUES
    ('Coopérative Test Nord', 'Nord', 'Ouahigouya', 'Cacao', 'contact@coop-nord.test', '+226 70 00 00 01', 'Coopérative de test pour vérification de l''enrichissement.', false),
    ('Union des Producteurs Sud', 'Sud-Ouest', 'Gaoua', 'Café', 'info@union-sud.test', '+226 70 00 00 02', 'Union de producteurs pour tests et démonstration.', false)
) AS v(name, region, department, sector, email, phone, description, is_verified)
WHERE NOT EXISTS (SELECT 1 FROM agrosoluce.cooperatives LIMIT 1);
