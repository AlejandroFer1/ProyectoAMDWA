export const Views = {
  home: `
    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content fade-in-up">
            <p class="hero-subtitle">ENTRENAMIENTO INTELIGENTE CON IA</p>
            <h1 class="hero-title">
                SUBE DE <br>
                <span>NIVEL</span>
            </h1>
            <p class="hero-description">
                La evolución del fitness ha llegado. Algoritmos avanzados que adaptan tu entrenamiento en tiempo real.
                Sin estancamientos. Sin límites. Conviértete en el Monarca de las Sombras de tu propio gimnasio.
            </p>
            <div class="hero-buttons">
                <a href="#register" class="btn" data-link>Empezar Ahora</a>
                <a href="#login" class="btn btn-accent" style="margin-left: 20px;" data-link>Inicia Sesión</a>
            </div>
        </div>
    </section>

    <!-- About / Philosophy Section -->
    <section id="about">
        <div class="container">
            <div class="about-grid">
                <div class="about-text fade-in-up">
                    <h2 class="section-title" style="text-align: left; left: 0; transform: none; margin-bottom: 2rem;">
                        El Despertar</h2>
                    <p style="margin-bottom: 1.5rem; color: #ccc;">
                        Como Sung Jinwoo pasó de ser el cazador más débil al más fuerte, tú también puedes transformar
                        tu cuerpo y mente.
                        <strong>Solo Leveling</strong> no es solo una app, es tu sistema de progresión personal.
                    </p>
                    <p style="margin-bottom: 1.5rem; color: #ccc;">
                        Democratizamos el fitness de alta calidad ($10-$15), eliminando las barreras económicas de un
                        entrenador personal.
                        Somos 100% digitales y sostenibles, comprometidos con el planeta y con tu salud.
                    </p>
                    <ul style="margin-top: 2rem;">
                        <li style="margin-bottom: 10px;">⚡ <strong>IA Avanzada:</strong> Algoritmos que aprenden de ti.
                        </li>
                        <li style="margin-bottom: 10px;">🌍 <strong>Sostenible:</strong> Cero papel, servidores verdes.
                        </li>
                        <li style="margin-bottom: 10px;">💪 <strong>Accesible:</strong> Calidad premium a bajo coste.
                        </li>
                    </ul>
                </div>
                <!-- Image: Jin Woo -->
                <div class="about-image fade-in-up">
                    <img src="img/jin-wo.jpeg" alt="Sung Jinwoo"
                        style="border-radius: 10px; border: 1px solid var(--color-primary); box-shadow: var(--glow-primary);">
                </div>
            </div>
        </div>
    </section>

    <!-- Parallax / Motivation Banner -->
    <section id="motivation"
        style="height: 400px; background: url('img/press-banca-anime.jpg') no-repeat center center/cover; position: relative; display: flex; align-items: center; justify-content: center; background-attachment: fixed;">
        <div style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
        <div class="container" style="position: relative; z-index: 2; text-align: center;">
            <h2 style="font-size: 3rem; color: #fff; text-shadow: 0 0 20px var(--color-primary);">SUPERA TUS LÍMITES
            </h2>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features">
        <div class="container">
            <h2 class="section-title fade-in-up">Tu Sistema</h2>
            <div class="features-grid">
                <div class="feature-card fade-in-up">
                    <div class="feature-icon">🧠</div>
                    <h3>Inteligencia Artificial</h3>
                    <p>El algoritmo garantiza la sobrecarga progresiva. Nunca más te preguntarás qué peso levantar.</p>
                </div>
                <div class="feature-card fade-in-up" style="transition-delay: 0.1s;">
                    <div class="feature-icon">📈</div>
                    <h3>Progresión Constante</h3>
                    <p>Evita el estancamiento. El sistema ajusta el volumen y la intensidad basándose en tu recuperación
                        y rendimiento.</p>
                </div>
                <div class="feature-card fade-in-up" style="transition-delay: 0.2s;">
                    <div class="feature-icon">💎</div>
                    <h3>Calidad Premium</h3>
                    <p>Entrenamiento de nivel olímpico al precio de un almuerzo. Precisión y ciencia a tu alcance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing">
        <div class="container fade-in-up">
            <h2 class="section-title">Únete al Gremio</h2>
            <div class="pricing-card">
                <h3>Suscripción Mensual</h3>
                <div class="price">$10 - $15<span>/mes</span></div>
                <p style="color: #aaa; margin-bottom: 20px;">Cancela cuando quieras.</p>
                <ul class="pricing-features">
                    <li>Entrenador IA Personalizado 24/7</li>
                    <li>Ajuste automático de cargas</li>
                    <li>Análisis de técnica (Beta)</li>
                    <li>Comunidad de Cazadores</li>
                    <li>Soporte Prioritario</li>
                </ul>
                <a href="#register" class="btn btn-accent" style="width: 100%;" data-link>Empezar Transición</a>
            </div>
        </div>
    </section>
    `,

  login: `
    <section id="login">
        <div class="container registration-container fade-in-up">
            <div class="registration-card">
                <h2 class="section-title">Acceso de Cazador</h2>
                <p class="registration-subtitle">Identifícate para continuar tu progresión.</p>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label for="login-email">Email del Gremio</label>
                        <input type="email" id="login-email" name="email" required placeholder="ejemplo@gremio.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password">Contraseña</label>
                        <input type="password" id="login-password" name="password" required placeholder="********">
                    </div>

                    <button type="submit" class="btn btn-accent full-width">Iniciar Sesión</button>
                    <p class="login-link">¿No tienes ID? <a href="#register" data-link>Regístrate y Despierta</a></p>
                </form>
            </div>
        </div>
    </section>
    `,

  register: `
    <section id="registration">
        <div class="container registration-container fade-in-up">
            <div class="registration-card">
                <h2 class="section-title">Registro de Cazador</h2>
                <p class="registration-subtitle">Crea tu ID de Jugador para comenzar el sistema.</p>
                
                <form id="registrationForm">
                    <!-- Account Info -->
                    <div class="form-group">
                        <label for="username">Nombre de Cazador (Usuario)</label>
                        <input type="text" id="username" name="username" required placeholder="Ej. SungJinWoo">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email del Gremio</label>
                        <input type="email" id="email" name="email" required placeholder="ejemplo@gremio.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required placeholder="********">
                    </div>

                    <!-- Initial QA / Stats -->
                    <h3 class="form-section-title">Evaluación Inicial (QA)</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="age">Edad</label>
                            <input type="number" id="age" name="age" required min="10" max="100">
                        </div>
                        <div class="form-group">
                            <label for="height">Altura (cm)</label>
                            <input type="number" id="height" name="height" required min="100" max="250">
                        </div>
                        <div class="form-group">
                            <label for="weight">Peso (kg)</label>
                            <input type="number" id="weight" name="weight" required min="30" max="300">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="activity">Nivel de Actividad Actual</label>
                        <select id="activity" name="activity" required>
                            <option value="" disabled selected>Selecciona tu nivel...</option>
                            <option value="sedentary">Civil (Sedentario)</option>
                            <option value="active">Cazador Novato (Activo 1-3 días)</option>
                            <option value="athlete">Cazador Avanzado (Activo 4+ días)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="goal">Objetivo Principal (Clase)</label>
                        <select id="goal" name="goal" required>
                            <option value="" disabled selected>Selecciona tu clase...</option>
                            <option value="strength">Guerrero (Fuerza)</option>
                            <option value="hypertrophy">Tanque (Masa Muscular)</option>
                            <option value="endurance">Asesino (Resistencia/Cardio)</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-accent full-width">Despertar</button>
                    <p class="login-link">¿Ya tienes ID? <a href="#" id="login-link-btn" data-link>Inicia Sesión</a></p>
                </form>
            </div>
        </div>
    </section>
    `,

  profile: `
    <section class="profile-header">
        <div class="container fade-in-up">
            <h1 class="section-title">Estado del Jugador</h1>
            
            <div class="hunter-card">
                <div class="avatar-section">
                    <div class="avatar">
                        <!-- Placeholder or uploaded image -->
                        <span style="font-size: 3rem;">👤</span>
                    </div>
                    <div class="rank-badge" id="player-rank">E</div>
                    <p style="color: var(--color-text-muted);">RANGO</p>
                </div>

                <div class="stats-grid">
                    <div class="job-title">
                        <span style="color: var(--color-text-muted);">NOMBRE:</span> <span id="player-name">Cargando...</span><br>
                        <span style="color: var(--color-text-muted); font-size: 1rem;">CLASE:</span> <span id="player-job" style="color: var(--color-accent);">Novato</span>
                    </div>

                    <div class="stat-item">
                        <div class="stat-label">Nivel</div>
                        <div class="stat-value" id="player-level">1</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Fuerza (STR)</div>
                        <div class="stat-value" id="stat-str">10</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Agilidad (AGI)</div>
                        <div class="stat-value" id="stat-agi">10</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Vitalidad (VIT)</div>
                        <div class="stat-value" id="stat-vit">10</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Fatiga</div>
                        <div class="stat-value">0%</div>
                    </div>
                     <div class="stat-item">
                        <div class="stat-label">Exp</div>
                        <div class="stat-value">0 / 100</div>
                    </div>
                </div>
            </div>

            <div class="action-section">
                <!-- Sprint 2: This button will trigger the generator -->
                <button id="generate-quest-btn" class="btn btn-accent" style="font-size: 1.2rem; padding: 15px 40px;">
                    GENERAR MISIÓN DIARIA
                </button>

                <div id="daily-quest" class="fade-in-up">
                    <h3 class="quest-title">📜 MISIÓN DIARIA: EL ENTRENAMIENTO</h3>
                    <p style="margin-bottom: 20px;">Completa los siguientes objetivos para obtener recompensas.</p>
                    <div id="quest-content">
                        <!-- Routine items will go here -->
                        <p>Iniciando sistema...</p>
                    </div>
                    <button class="btn" style="margin-top: 20px;">Completar Misión</button>
                </div>
            </div>
        </div>
    </section>
    `,

  philosophy: `
    <!-- Hero -->
    <section class="philosophy-hero">
        <div class="container fade-in-up">
            <h1 class="hero-title" style="font-size: 4rem;">EL DESPERTAR</h1>
            <p class="hero-subtitle">NO ES SOLO ENTRENAMIENTO. ES EVOLUCIÓN.</p>
        </div>
    </section>
    
    <!-- Content -->
    <section class="philosophy-content">
        <div class="container">
            
            <div class="mindset-card fade-in-up">
                <h3>1. Nadie te salvará excepto tú mismo</h3>
                <p>En el mundo de los cazadores, esperar ayuda es una sentencia de muerte. En tu vida, esperar el "momento perfecto" es quedarte estancado.</p>
                <br>
                <p>El "Sistema" eres tú. Cada repetición, cada comida, cada hora de sueño es una misión diaria que debes completar. No lo haces por aplausos, lo haces para sobrevivir y conquistar tu propia debilidad.</p>
            </div>

            <div class="mindset-card fade-in-up">
                <h3>2. La Progresión Infinita</h3>
                <p>Sung Jinwoo no pasó de Rango E a Monarca en un día. Fue una acumulación constante de batallas al borde de la muerte.</p>
                <br>
                <p>Nos basamos en la <strong>Sobrecarga Progresiva</strong>. Si ayer levantaste 50kg, hoy tu objetivo es 52.5kg. Si ayer corriste 5km, hoy corres 5.1km. No aceptamos el estancamiento. Siempre hay un nivel superior.</p>
            </div>

            <div class="quote-box fade-in-up">
                "Protegeré a mi familia, incluso si eso significa convertirme en el mismísimo mal. Pero para protegerlos, necesito poder. Poder absoluto."
                <span class="quote-author">- Sung Jinwoo</span>
            </div>

            <div class="mindset-card fade-in-up" style="border-left-color: var(--color-accent);">
                <h3>3. El Futuro: Tu Asistente IA (El Sistema)</h3>
                <p>Tal como Jinwoo tenía una voz en su cabeza guiando su crecimiento, nosotros estamos construyendo esa inteligencia para ti.</p>
                <br>
                <p>Próximamente, implementaremos una <strong>Inteligencia Artificial Real</strong> que no solo generará rutinas, sino que responderá tus dudas, analizará tu técnica mediante cámara y adaptará tu nutrición en tiempo real. Esto es solo el comienzo de tu despertar.</p>
            </div>

            <div style="text-align: center; margin-top: 60px;">
                <a href="#register" class="btn btn-accent" style="font-size: 1.5rem; padding: 20px 50px;" data-link>ACEPTAR LA MISIÓN</a>
            </div>

        </div>
    </section>
    `,
};
