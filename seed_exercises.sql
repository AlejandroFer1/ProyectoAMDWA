TRUNCATE TABLE exercises CASCADE;

INSERT INTO exercises (name, muscle_group, rank, type, location, image_url, video_url, instructions) VALUES
-- Rank E
('Sentadillas (Air Squats)', 'Legs', 'E', 'Strength', 'Both', 
 'img/exercises/squat.jpg', 'https://www.youtube.com/embed/m0GcZ24Vk6k?si=XzWzJqMAlJ4tqJ-a', 
 '1. Pies a la anchura de los hombros.\n2. Baja la cadera como si te sentaras.\n3. Mantén la espalda recta.'),

('Zancadas (Lunges)', 'Legs', 'E', 'Strength', 'Both',
 'img/exercises/lunge.jpg', 'https://www.youtube.com/embed/QOVaHwm-Q6U?si=JqMAlJ4tqJ-aKz8_',
 '1. Da un paso largo hacia adelante.\n2. Baja la rodilla trasera casi al suelo.\n3. Alterna piernas.'),

('Plancha (Plank)', 'Core', 'E', 'Stamina', 'Both',
 'img/exercises/plank.jpg', 'https://www.youtube.com/embed/ASdvN_XEl_c?si=JqMAlJ4tqJ-aKz8_',
 '1. Apóyate en antebrazos y puntas de pie.\n2. Mantén el cuerpo recto como una tabla.\n3. Contrae abdomen y glúteos.'),

('Jumping Jacks', 'Full Body', 'E', 'Cardio', 'Both',
 'img/exercises/jumping_jacks.jpg', 'https://www.youtube.com/embed/2W4Z742r5uk',
 '1. Salta abriendo piernas y brazos.\n2. Salta cerrando piernas y brazos.\n3. Mantén un ritmo constante.'),

('Flexiones de Rodillas', 'Chest', 'E', 'Strength', 'Both',
 'img/exercises/knee_pushup.jpg', 'https://www.youtube.com/embed/IODxDxX7oi4?si=JqMAlJ4tqJ-aKz8_',
 '1. Apoya rodillas en el suelo.\n2. Baja el pecho hasta el suelo.\n3. Empuja para subir.'),

-- Rank D
('Flexiones Estándar', 'Chest', 'D', 'Strength', 'Both',
 'img/exercises/pushup.jpg', 'https://www.youtube.com/embed/IODxDxX7oi4?si=JqMAlJ4tqJ-aKz8_',
 '1. Manos bajo los hombros.\n2. Cuerpo recto.\n3. Baja hasta tocar el suelo con el pecho.'),

('Burpees', 'Full Body', 'D', 'Explosive', 'Both',
 'img/exercises/burpee.jpg', 'https://www.youtube.com/embed/TU8QYXL8gSk?si=JqMAlJ4tqJ-aKz8_',
 '1. Sentadilla.\n2. Plancha.\n3. Flexión.\n4. Salto vertical.'),

('Mountain Climbers', 'Core', 'D', 'Cardio', 'Both',
 'img/exercises/mountain_climber.jpg', 'https://www.youtube.com/embed/nmwgirgXLYM?si=JqMAlJ4tqJ-aKz8_',
 '1. Posición de plancha alta.\n2. Lleva rodillas al pecho alternadamente.\n3. Rápido y controlado.'),

('Fondos en Banco', 'Arms', 'D', 'Strength', 'Both',
 'img/exercises/dips.jpg', 'https://www.youtube.com/embed/2z8JmcrW-As?si=JqMAlJ4tqJ-aKz8_',
 '1. Apoya manos en un banco/silla detrás de ti.\n2. Baja doblando codos.\n3. Sube extendiendo brazos.'),

-- Rank C
('Dominadas (Pull-ups)', 'Back', 'C', 'Strength', 'Both',
 'img/exercises/pullup.jpg', 'https://www.youtube.com/embed/eGo4IYlbE5g?si=JqMAlJ4tqJ-aKz8_',
 '1. Cuélgate de la barra.\n2. Sube hasta pasar la barbilla.\n3. Controla la bajada.'),

('Flexiones Diamante', 'Arms', 'C', 'Strength', 'Both',
 'img/exercises/diamond_pushup.jpg', 'https://www.youtube.com/embed/J0DnG1_S92I?si=JqMAlJ4tqJ-aKz8_',
 '1. Une índices y pulgares bajo el pecho.\n2. Realiza una flexión.\n3. Enfócate en los tríceps.'),

('Sentadillas con Salto', 'Legs', 'C', 'Explosive', 'Both',
 'img/exercises/jump_squat.jpg', 'https://www.youtube.com/embed/CVaEhXotL7M?si=JqMAlJ4tqJ-aKz8_',
 '1. Sentadilla profunda.\n2. Salta explosivamente hacia arriba.\n3. Amortigua la caída.'),

-- Advanced (B/A)
('Muscle-up', 'Upper Body', 'B', 'Explosive', 'Both',
 'img/exercises/muscleup.jpg', 'https://www.youtube.com/embed/0_R78N3o1lI',
 '1. Dominada explosiva.\n2. Transición sobre la barra.\n3. Fondo final.'),

('Pistol Squats', 'Legs', 'B', 'Strength', 'Both',
 'img/exercises/pistol.jpg', 'https://www.youtube.com/embed/qDcniqddTeE',
 '1. Sentadilla a una pierna.\n2. La otra pierna estirada al frente.\n3. Equilibrio y fuerza.'),

('Handstand Push-up', 'Shoulders', 'A', 'Strength', 'Both',
 'img/exercises/hspu.jpg', 'https://www.youtube.com/embed/hO_dw4n2Vp0',
 '1. Pino contra la pared.\n2. Baja la cabeza hasta el suelo.\n3. Empuja hasta extender brazos.');
