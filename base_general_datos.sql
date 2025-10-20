BEGIN;

-- =========================
-- EMPRESAS (tenants)
-- =========================
INSERT INTO tb_empresas (e_nombre, e_descripcion, e_email, e_numero_tel, e_responsable)
VALUES
  ('Acme IoT',   'Monitoreo industrial', 'contacto@acme.test', '0999999999', 'Ana Pérez'),
  ('GreenFarm',  'Agrotech y riego',     'info@greenfarm.test','0988888888', 'Luis Gómez');

-- =========================
-- CONEXIONES por empresa
-- =========================
-- Acme IoT
INSERT INTO tb_conexiones (c_id_empresa, c_host, c_puerto, c_nombre_base_de_datos, c_usuario, c_contrasena)
SELECT e_id, 'localhost', 5432, 'acme_iot', 'acme_user', '$argon2id$v=19$m=65536,t=3,p=2$acme$somelonghash'
FROM tb_empresas
WHERE e_nombre = 'Acme IoT';

-- GreenFarm
INSERT INTO tb_conexiones (c_id_empresa, c_host, c_puerto, c_nombre_base_de_datos, c_usuario, c_contrasena)
SELECT e_id, 'localhost', 5432, 'greenfarm_iot', 'gf_user', '$argon2id$v=19$m=65536,t=3,p=2$greenfarm$somelonghash'
FROM tb_empresas
WHERE e_nombre = 'GreenFarm';

-- =========================
-- ROLES globales
-- =========================
INSERT INTO tb_roles_usuarios (ru_nombre, ru_descripcion)
VALUES
  ('admin',    'Administración total'),
  ('operador', 'Operación y monitoreo'),
  ('viewer',   'Solo lectura')
ON CONFLICT (ru_nombre) DO NOTHING;

-- =========================
-- USUARIOS globales
-- (contraseñas de ejemplo: hashes/placeholder)
-- =========================
INSERT INTO tb_usuarios (u_nombre, u_email, u_contrasena)
VALUES
  ('Ana Admin',     'ana@acme.test',    '$2b$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), -- bcrypt dummy
  ('Oscar Oper',    'oscar@acme.test',  '$2b$12$bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
  ('Violeta View',  'violeta@acme.test','$2b$12$cccccccccccccccccccccccccccccccccccccccccccccccccccccccc'),
  ('Greta Farm',    'greta@greenfarm.test', '$2b$12$dddddddddddddddddddddddddddddddddddddddddddddddddddd')
ON CONFLICT (u_email) DO NOTHING;

-- =========================
-- PERFILES (usuario-rol-empresa)
-- usa ON CONFLICT para no duplicar combinaciones
-- =========================
-- Ana -> admin @ Acme
INSERT INTO tb_perfiles (p_id_usuario, p_id_rol, p_id_empresa)
SELECT u.u_id, r.ru_id, e.e_id
FROM tb_usuarios u
JOIN tb_roles_usuarios r ON r.ru_nombre = 'admin'
JOIN tb_empresas e ON e.e_nombre = 'Acme IoT'
WHERE u.u_email = 'ana@acme.test'
ON CONFLICT ON CONSTRAINT uq_perfil DO NOTHING;

-- Oscar -> operador @ Acme
INSERT INTO tb_perfiles (p_id_usuario, p_id_rol, p_id_empresa)
SELECT u.u_id, r.ru_id, e.e_id
FROM tb_usuarios u
JOIN tb_roles_usuarios r ON r.ru_nombre = 'operador'
JOIN tb_empresas e ON e.e_nombre = 'Acme IoT'
WHERE u.u_email = 'oscar@acme.test'
ON CONFLICT ON CONSTRAINT uq_perfil DO NOTHING;

-- Violeta -> viewer @ Acme
INSERT INTO tb_perfiles (p_id_usuario, p_id_rol, p_id_empresa)
SELECT u.u_id, r.ru_id, e.e_id
FROM tb_usuarios u
JOIN tb_roles_usuarios r ON r.ru_nombre = 'viewer'
JOIN tb_empresas e ON e.e_nombre = 'Acme IoT'
WHERE u.u_email = 'violeta@acme.test'
ON CONFLICT ON CONSTRAINT uq_perfil DO NOTHING;

-- Greta -> operador @ GreenFarm
INSERT INTO tb_perfiles (p_id_usuario, p_id_rol, p_id_empresa)
SELECT u.u_id, r.ru_id, e.e_id
FROM tb_usuarios u
JOIN tb_roles_usuarios r ON r.ru_nombre = 'operador'
JOIN tb_empresas e ON e.e_nombre = 'GreenFarm'
WHERE u.u_email = 'greta@greenfarm.test'
ON CONFLICT ON CONSTRAINT uq_perfil DO NOTHING;

-- =========================
-- DATOS CRUDOS (staging global)
-- Varios ejemplos: con y sin empresa, con/ sin nodo, JSONB variado
-- =========================

-- Mensaje de temperatura para Acme (sin nodo identificado)
INSERT INTO tb_datos_crudos (dc_id_empresa, dc_id_nodo, dc_mensaje, dc_recibido_en)
VALUES (
  (SELECT e_id FROM tb_empresas WHERE e_nombre = 'Acme IoT'),
  NULL,
  '{"dispositivo":"dev-AC-001","tipo":"temperatura","valor":24.7,"unidad":"C","fw":"1.2.3"}'::jsonb,
  NOW() - INTERVAL '10 minutes'
);

-- Mensaje de humedad para Acme (nodo 101 referencial, puede ser NULL en tu flujo real)
INSERT INTO tb_datos_crudos (dc_id_empresa, dc_id_nodo, dc_mensaje, dc_recibido_en)
VALUES (
  (SELECT e_id FROM tb_empresas WHERE e_nombre = 'Acme IoT'),
  101,
  '{"dispositivo":"dev-AC-002","tipo":"humedad","valor":55.2,"unidad":"%","bateria":92}'::jsonb,
  NOW() - INTERVAL '5 minutes'
);

-- Mensaje de riego para GreenFarm (sin nodo)
INSERT INTO tb_datos_crudos (dc_id_empresa, dc_id_nodo, dc_mensaje, dc_recibido_en)
VALUES (
  (SELECT e_id FROM tb_empresas WHERE e_nombre = 'GreenFarm'),
  NULL,
  '{"dispositivo":"gf-VALV-01","tipo":"riego","estado":"ON","litros":12.5,"duracion_s":120}'::jsonb,
  NOW() - INTERVAL '2 minutes'
);

-- Mensaje sin empresa identificada (quedará para clasificación posterior)
INSERT INTO tb_datos_crudos (dc_id_empresa, dc_id_nodo, dc_mensaje, dc_recibido_en)
VALUES (
  NULL,
  NULL,
  '{"dispositivo":"unknown-xyz","tipo":"telemetria","payload":{"rssi":-71,"snr":6.2},"nota":"pendiente de clasificación"}'::jsonb,
  NOW() - INTERVAL '1 minute'
);

-- Otro mensaje “fault” con error_log
INSERT INTO tb_datos_crudos (dc_id_empresa, dc_id_nodo, dc_mensaje, dc_recibido_en, dc_error_log)
VALUES (
  (SELECT e_id FROM tb_empresas WHERE e_nombre = 'GreenFarm'),
  202,
  '{"dispositivo":"gf-PUMP-07","tipo":"fault","codigo":"E32","desc":"sobrecalentamiento"}'::jsonb,
  NOW(),
  'parser: campo "temp" ausente; origen=gw-east-1'
);

COMMIT;
