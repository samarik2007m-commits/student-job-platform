import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:4000/api';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loginForm, setLoginForm] = useState({ email: 'student@example.com', password: '123456' });
  const [registerForm, setRegisterForm] = useState(initialForm);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setJobs([]));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory =
        selectedCategory === 'all' || job.category === selectedCategory;
      const matchesSearch =
        !search ||
        `${job.title} ${job.company} ${job.city} ${job.tags.join(' ')}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [jobs, search, selectedCategory]);

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });

    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.message || 'Ошибка логина');
      return;
    }

    setUser(data.user);
    setAuthMessage('Вы успешно вошли в систему');
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    });

    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.message || 'Ошибка регистрации');
      return;
    }

    setAuthMessage('Регистрация успешна. Теперь можно войти.');
    setRegisterForm(initialForm);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span>StudentJob</span>
          </div>

          <nav className="nav-links">
            <a href="#home">Главная</a>
            <a href="#jobs">Вакансии</a>
            <a href="#profile">Профиль</a>
          </nav>

          <div className="nav-actions">
            <button className="btn btn-light">Войти</button>
            <button className="btn btn-primary">Найти работу</button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge">Для студентов и молодых специалистов</span>
              <h1>Найди работу, которая поможет расти.</h1>
              <p>
                Стажировки, частичная занятость, удалённые проекты и первые шаги в
                карьере — всё в одном месте.
              </p>

              <div className="search-box">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск: frontend, маркетинг, UI/UX"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Все направления</option>
                  <option value="development">Разработка</option>
                  <option value="design">Дизайн</option>
                  <option value="marketing">Маркетинг</option>
                  <option value="finance">Финансы</option>
                  <option value="support">Поддержка</option>
                </select>
                <button className="btn btn-primary">Найти</button>
              </div>

              <div className="stats-row">
                <div>
                  <strong>1200+</strong>
                  <span>вакансий</span>
                </div>
                <div>
                  <strong>340</strong>
                  <span>компаний</span>
                </div>
                <div>
                  <strong>98%</strong>
                  <span>подходящих</span>
                </div>
              </div>
            </div>

            <div className="visual-panel">
              <div className="job-card-preview">
                <div className="preview-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>

                <div className="preview-content">
                  <span className="mini-tag">Frontend</span>
                  <h3>Junior Frontend Developer</h3>
                  <p>Remote • 3-4 дня в неделю</p>
                  <ul>
                    <li>React</li>
                    <li>UI/UX</li>
                    <li>Git</li>
                  </ul>
                </div>
              </div>

              <div className="floating-card small">
                <span>💼</span>
                <div>
                  <strong>+240</strong>
                  <small>новых вакансий</small>
                </div>
              </div>

              <div className="floating-card bigger">
                <span>✨</span>
                <div>
                  <strong>Подходит тебе</strong>
                  <small>по навыкам</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="partners">
          <div className="container partner-row">
            <span>Google</span>
            <span>Yandex</span>
            <span>VK</span>
            <span>Mail.ru</span>
            <span>Сбер</span>
            <span>Тинькофф</span>
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="container">
            <div className="section-heading">
              <span className="badge badge-alt">Подборка вакансий</span>
              <h2>Популярные предложения</h2>
            </div>

            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <article className="job-box" key={job.id}>
                  <div className="job-top">
                    <div className={`job-badge ${job.category}`}>
                      {job.company.slice(0, 3).toUpperCase()}
                    </div>
                    <span className="job-type">{job.type}</span>
                  </div>

                  <h3>{job.title}</h3>
                  <p className="job-info">{job.company} • {job.city}</p>
                  <p className="job-desc">
                    Отличный вариант для студентов, которые хотят получить опыт и
                    развиваться в профессии.
                  </p>

                  <div className="tags-row">
                    {job.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="job-bottom">
                    <strong>{job.salary}</strong>
                    <button className="btn btn-light small">Откликнуться</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <div className="section-heading center">
              <span className="badge badge-alt">Почему выбирают нас</span>
              <h2>Удобство для студентов и компаний</h2>
            </div>

            <div className="features-grid">
              <div className="feature-box">
                <div className="icon">🎯</div>
                <h3>Точные совпадения</h3>
                <p>Подбираем вакансии по навыкам, образованию и опыту.</p>
              </div>

              <div className="feature-box">
                <div className="icon">💬</div>
                <h3>Простое общение</h3>
                <p>Компания и студент быстро находят общий язык.</p>
              </div>

              <div className="feature-box">
                <div className="icon">📈</div>
                <h3>Первые шаги в карьере</h3>
                <p>Подходящие проекты, стажировки и частичная занятость.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-wrap" id="profile">
          <div className="container auth-grid">
            <div className="auth-box">
              <span className="badge badge-alt">Вход</span>
              <h3>Личный кабинет</h3>

              <form onSubmit={handleLogin} className="auth-form">
                <label>
                  Email
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Пароль
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                </label>

                <button type="submit" className="btn btn-primary full-width">
                  Войти
                </button>
              </form>
            </div>

            <div className="auth-box">
              <span className="badge badge-alt">Регистрация</span>
              <h3>Создать профиль</h3>

              <form onSubmit={handleRegister} className="auth-form">
                <label>
                  Имя
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Пароль
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                </label>

                <button type="submit" className="btn btn-primary full-width">
                  Зарегистрироваться
                </button>
              </form>
            </div>
          </div>

          {authMessage && <div className="message-box">{authMessage}</div>}

          {user && (
            <div className="container profile-box">
              <div className="profile-header">
                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-grid">
                <div>
                  <label>Навыки</label>
                  <div className="tags-row">
                    {(user.skills || ['HTML', 'CSS', 'JavaScript']).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <label>О себе</label>
                  <p>
                    {user.bio || 'Студент, ищущий первые проекты и стажировки.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span>StudentJob</span>
          </div>
          <p>© 2026 StudentJob</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
