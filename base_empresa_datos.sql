BEGIN;

-- ============================
-- 1) CATÁLOGO: Tipos de dato
-- ============================
INSERT INTO tb_sensores_tipos_dato (std_nombre, std_unidad, std_descripcion, std_var_json)
VALUES
  ('Temperatura', 'C',   'Grados Celsius', 'temperatura'),
  ('Humedad',     '%',   'Humedad relativa', 'humedad'),
  ('Presión',     'kPa', 'Presión manométrica', 'presion'),
  ('Caudal',      'L/min', 'Caudal instantáneo', 'caudal')
ON CONFLICT (LOWER(std_nombre)) DO NOTHING;

-- ============================
-- 2) Proyectos
-- ============================
INSERT INTO tb_proyectos (p_nombre, p_descripcion)
VALUES
  ('Línea A', 'Producción y envasado'),
  ('Línea B', 'Tratamiento y bombeo')
ON CONFLICT DO NOTHING;

-- ============================
-- 3) Nodos por proyecto
-- ============================
INSERT INTO tb_nodos (n_nombre, n_ubicacion, n_id_proyecto)
SELECT 'Nodo-A1', 'Sala 1', p_id FROM tb_proyectos WHERE p_nombre = 'Línea A'
ON CONFLICT DO NOTHING;

INSERT INTO tb_nodos (n_nombre, n_ubicacion, n_id_proyecto)
SELECT 'Nodo-A2', 'Sala 2', p_id FROM tb_proyectos WHERE p_nombre = 'Línea A'
ON CONFLICT DO NOTHING;

INSERT INTO tb_nodos (n_nombre, n_ubicacion, n_id_proyecto)
SELECT 'Nodo-B1', 'Planta Baja', p_id FROM tb_proyectos WHERE p_nombre = 'Línea B'
ON CONFLICT DO NOTHING;

-- ============================
-- 4) Sensores por nodo
-- ============================
INSERT INTO tb_sensores (s_nombre, s_id_nodo)
SELECT 'Temp-A1-01', n_id FROM tb_nodos WHERE n_nombre = 'Nodo-A1'
ON CONFLICT DO NOTHING;

INSERT INTO tb_sensores (s_nombre, s_id_nodo)
SELECT 'Hum-A1-01', n_id FROM tb_nodos WHERE n_nombre = 'Nodo-A1'
ON CONFLICT DO NOTHING;

INSERT INTO tb_sensores (s_nombre, s_id_nodo)
SELECT 'Pres-B1-01', n_id FROM tb_nodos WHERE n_nombre = 'Nodo-B1'
ON CONFLICT DO NOTHING;

INSERT INTO tb_sensores (s_nombre, s_id_nodo)
SELECT 'Caudal-B1-01', n_id FROM tb_nodos WHERE n_nombre = 'Nodo-B1'
ON CONFLICT DO NOTHING;

-- ============================
-- 5) Compatibilidad Sensor ↔ Tipo
-- ============================
-- Temp-A1-01 soporta Temperatura
INSERT INTO tb_tipos_sensores_soportados (tss_id_sensor, tss_id_tipo)
SELECT s.s_id, t.std_id
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Temperatura'
WHERE s.s_nombre = 'Temp-A1-01'
ON CONFLICT (tss_id_sensor, tss_id_tipo) DO NOTHING;

-- Hum-A1-01 soporta Humedad
INSERT INTO tb_tipos_sensores_soportados (tss_id_sensor, tss_id_tipo)
SELECT s.s_id, t.std_id
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Humedad'
WHERE s.s_nombre = 'Hum-A1-01'
ON CONFLICT (tss_id_sensor, tss_id_tipo) DO NOTHING;

-- Pres-B1-01 soporta Presión
INSERT INTO tb_tipos_sensores_soportados (tss_id_sensor, tss_id_tipo)
SELECT s.s_id, t.std_id
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Presión'
WHERE s.s_nombre = 'Pres-B1-01'
ON CONFLICT (tss_id_sensor, tss_id_tipo) DO NOTHING;

-- Caudal-B1-01 soporta Caudal
INSERT INTO tb_tipos_sensores_soportados (tss_id_sensor, tss_id_tipo)
SELECT s.s_id, t.std_id
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Caudal'
WHERE s.s_nombre = 'Caudal-B1-01'
ON CONFLICT (tss_id_sensor, tss_id_tipo) DO NOTHING;

-- (Opcional) Temp-A1-01 también reporta Humedad (si tu hardware lo hace)
INSERT INTO tb_tipos_sensores_soportados (tss_id_sensor, tss_id_tipo)
SELECT s.s_id, t.std_id
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Humedad'
WHERE s.s_nombre = 'Temp-A1-01'
ON CONFLICT (tss_id_sensor, tss_id_tipo) DO NOTHING;

-- ============================
-- 6) Umbrales por sensor/tipo
-- ============================
-- Temperatura: 18–28 C
INSERT INTO tb_umbrales (um_id_sensor, um_id_tipo, um_valor_min, um_valor_max)
SELECT s.s_id, t.std_id, 18.0, 28.0
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Temperatura'
WHERE s.s_nombre = 'Temp-A1-01'
ON CONFLICT (um_id_sensor, um_id_tipo) DO UPDATE
SET um_valor_min = EXCLUDED.um_valor_min,
    um_valor_max = EXCLUDED.um_valor_max;

-- Humedad: 40–70 %
INSERT INTO tb_umbrales (um_id_sensor, um_id_tipo, um_valor_min, um_valor_max)
SELECT s.s_id, t.std_id, 40.0, 70.0
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Humedad'
WHERE s.s_nombre IN ('Hum-A1-01','Temp-A1-01')  -- si Temp-A1-01 también envía HR
ON CONFLICT (um_id_sensor, um_id_tipo) DO UPDATE
SET um_valor_min = EXCLUDED.um_valor_min,
    um_valor_max = EXCLUDED.um_valor_max;

-- Presión: 180–320 kPa
INSERT INTO tb_umbrales (um_id_sensor, um_id_tipo, um_valor_min, um_valor_max)
SELECT s.s_id, t.std_id, 180.0, 320.0
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Presión'
WHERE s.s_nombre = 'Pres-B1-01'
ON CONFLICT (um_id_sensor, um_id_tipo) DO UPDATE
SET um_valor_min = EXCLUDED.um_valor_min,
    um_valor_max = EXCLUDED.um_valor_max;

-- Caudal: 5–20 L/min
INSERT INTO tb_umbrales (um_id_sensor, um_id_tipo, um_valor_min, um_valor_max)
SELECT s.s_id, t.std_id, 5.0, 20.0
FROM tb_sensores s
JOIN tb_sensores_tipos_dato t ON t.std_nombre = 'Caudal'
WHERE s.s_nombre = 'Caudal-B1-01'
ON CONFLICT (um_id_sensor, um_id_tipo) DO UPDATE
SET um_valor_min = EXCLUDED.um_valor_min,
    um_valor_max = EXCLUDED.um_valor_max;

-- ============================
-- 7) Lecturas de ejemplo
-- ============================
-- Temperatura (dentro, luego fuera de rango)
INSERT INTO tb_lecturas_sensores (ls_valor, ls_fecha, ls_id_sensor, ls_id_sensores_tipo)
SELECT 24.6, NOW() - INTERVAL '15 minutes', s.s_id, t.std_id
FROM tb_sensores s JOIN tb_sensores_tipos_dato t ON t.std_nombre='Temperatura'
WHERE s.s_nombre='Temp-A1-01';

INSERT INTO tb_lecturas_sensores (ls_valor, ls_fecha, ls_id_sensor, ls_id_sensores_tipo)
SELECT 29.2, NOW() - INTERVAL '5 minutes', s.s_id, t.std_id
FROM tb_sensores s JOIN tb_sensores_tipos_dato t ON t.std_nombre='Temperatura'
WHERE s.s_nombre='Temp-A1-01';

-- Humedad (dentro de rango)
INSERT INTO tb_lecturas_sensores (ls_valor, ls_fecha, ls_id_sensor, ls_id_sensores_tipo)
SELECT 52.0, NOW() - INTERVAL '7 minutes', s.s_id, t.std_id
FROM tb_sensores s JOIN tb_sensores_tipos_dato t ON t.std_nombre='Humedad'
WHERE s.s_nombre='Hum-A1-01';

-- Presión (fuera de rango alto)
INSERT INTO tb_lecturas_sensores (ls_valor, ls_fecha, ls_id_sensor, ls_id_sensores_tipo)
SELECT 335.0, NOW() - INTERVAL '2 minutes', s.s_id, t.std_id
FROM tb_sensores s JOIN tb_sensores_tipos_dato t ON t.std_nombre='Presión'
WHERE s.s_nombre='Pres-B1-01';

-- Caudal (normal)
INSERT INTO tb_lecturas_sensores (ls_valor, ls_fecha, ls_id_sensor, ls_id_sensores_tipo)
SELECT 12.3, NOW() - INTERVAL '1 minute', s.s_id, t.std_id
FROM tb_sensores s JOIN tb_sensores_tipos_dato t ON t.std_nombre='Caudal'
WHERE s.s_nombre='Caudal-B1-01';

-- ============================
-- 8) Alertas según lecturas
-- ============================
-- Alerta por temperatura alta
INSERT INTO tb_alertas (a_mensaje, a_id_sensor, a_creado_en)
SELECT 'Temperatura fuera de rango (>28 C)', s.s_id, NOW()
FROM tb_sensores s WHERE s.s_nombre='Temp-A1-01';

-- Alerta por presión alta
INSERT INTO tb_alertas (a_mensaje, a_id_sensor, a_creado_en)
SELECT 'Presión fuera de rango (>320 kPa)', s.s_id, NOW()
FROM tb_sensores s WHERE s.s_nombre='Pres-B1-01';

-- ============================
-- 9) Distribución de alertas a usuarios (IDs globales de ejemplo)
-- ============================
-- Última alerta de Temp → usuarios 1 y 2
INSERT INTO tb_alertas_usuarios (au_id_alerta, au_id_usuario)
SELECT a.a_id, 1
FROM tb_alertas a
JOIN tb_sensores s ON a.a_id_sensor = s.s_id
WHERE s.s_nombre='Temp-A1-01'
ORDER BY a.a_creado_en DESC LIMIT 1
ON CONFLICT (au_id_alerta, au_id_usuario) DO NOTHING;

INSERT INTO tb_alertas_usuarios (au_id_alerta, au_id_usuario)
SELECT a.a_id, 2
FROM tb_alertas a
JOIN tb_sensores s ON a.a_id_sensor = s.s_id
WHERE s.s_nombre='Temp-A1-01'
ORDER BY a.a_creado_en DESC LIMIT 1
ON CONFLICT (au_id_alerta, au_id_usuario) DO NOTHING;

-- Última alerta de Presión → usuario 1
INSERT INTO tb_alertas_usuarios (au_id_alerta, au_id_usuario)
SELECT a.a_id, 1
FROM tb_alertas a
JOIN tb_sensores s ON a.a_id_sensor = s.s_id
WHERE s.s_nombre='Pres-B1-01'
ORDER BY a.a_creado_en DESC LIMIT 1
ON CONFLICT (au_id_alerta, au_id_usuario) DO NOTHING;

COMMIT;
