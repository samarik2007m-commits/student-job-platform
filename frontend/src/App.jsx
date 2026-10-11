const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const JOBS_PATH = path.join(DATA_DIR, 'jobs.json');

app.use(cors());
app.use(express.json());

const defaultUsers = [
  {
    id: 1,
    name: 'Demo Student',
    email: 'student@example.com',
    password: '123456',
    role: 'student',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    bio: 'Студент IT-направления. Ищу стажировку и первые проекты.',
    status: 'Ищет работу'
  },
  {
    id: 2,
    name: 'Astra Hiring',
    email: 'employer@example.com',
    password: '123456',
    role: 'employer',
    company: 'Astra Digital',
    status: 'Активен'
  },
  {
    id: 3,
    name: 'Admin Panel',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    status: 'Администратор'
  }
];

const defaultJobs = [
  {
    id: 1,
    title: 'Junior Frontend Developer',
    company: 'Astra Digital',
    city: 'Москва',
    type: 'Полный день',
    category: 'development',
    salary: 'от 80 000 ₽',
    tags: ['React', 'JavaScript', 'Remote'],
    applicants: [],
    createdAt: Date.now()
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Bright Media',
    city: 'Санкт-Петербург',
    type: 'Удалённо',
    category: 'marketing',
    salary: 'от 45 000 ₽',
    tags: ['SMM', 'SEO', 'Analytics'],
    applicants: [],
    createdAt: Date.now() - 86400000
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Pixel Studio',
    city: 'Казань',
    type: 'Стажировка',
    category: 'design',
    salary: 'от 50 000 ₽',
    tags: ['Figma', 'UX', 'Research'],
    applicants: [],
    createdAt: Date.now() - 172800000
  },
  {
    id: 4,
    title: 'Finance Analyst Intern',
    company: 'NovaCapital',
    city: 'Новосибирск',
    type: 'Частичная занятость',
    category: 'finance',
    salary: 'от 60 000 ₽',
    tags: ['Excel', 'Finance', 'Data'],
    applicants: [],
    createdAt: Date.now() - 259200000
  },
  {
    id: 5,
    title: 'Customer Support Specialist',
    company: 'HelioCare',
    city: 'Екатеринбург',
    type: 'Удалённо',
    category: 'support',
    salary: 'от 42 000 ₽',
    tags: ['Support', 'Chat', 'Client'],
    applicants: [],
    createdAt: Date.now() - 345600000
  },
  {
    id: 6,
    title: 'Backend Trainee',
    company: 'CoreStack',
    city: 'Москва',
    type: 'Тестовый проект',
    category: 'development',
    salary: 'от 70 000 ₽',
    tags: ['Node.js', 'API', 'SQL'],
    applicants: [],
    createdAt: Date.now() - 432000000
  }
];

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify(defaultUsers, null, 2));
  }

  if (!fs.existsSync(JOBS_PATH)) {
    fs.writeFileSync(JOBS_PATH, JSON.stringify(defaultJobs, null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function getUsers() {
  return readJson(USERS_PATH, defaultUsers);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function getJobs() {
  return readJson(JOBS_PATH, defaultJobs);
}

function saveJobs(jobs) {
  fs.writeFileSync(JOBS_PATH, JSON.stringify(jobs, null, 2));
}

ensureDataFiles();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudentJob API is running' });
});

app.get('/api/stats', (req, res) => {
  const users = getUsers();
  const jobs = getJobs();

  const stats = {
    jobsTotal: jobs.length,
    students: users.filter((u) => u.role === 'student').length,
    employers: users.filter((u) => u.role === 'employer').length,
    admins: users.filter((u) => u.role === 'admin').length,
    applications: jobs.reduce(
      (sum, job) => sum + (Array.isArray(job.applicants) ? job.applicants.length : 0),
      0
    )
  };

  res.json(stats);
});

app.get('/api/jobs', (req, res) => {
  const jobs = getJobs();
  jobs.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  res.json(jobs);
});

app.post('/api/register', (req, res) => {
  const { name, email, password, role = 'student', company } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Необходимо заполнить все поля' });
  }

  const users = getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

  if (existing) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
  }

  const cleanRole = ['student', 'employer', 'admin'].includes(role) ? role : 'student';

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: cleanRole,
    company: cleanRole === 'employer' ? company || 'My Company' : '',
    skills: cleanRole === 'student' ? ['HTML', 'CSS'] : [],
    bio: cleanRole === 'student' ? 'Новый студент, ищущий возможности для развития.' : 'Компания готова к сотрудничеству.',
    status: cleanRole === 'student' ? 'Ищет работу' : 'Активен'
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: 'Регистрация успешна',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  const users = getUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === String(email).toLowerCase() && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  res.json({
    message: 'Успешный вход',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || '',
      skills: user.skills || [],
      bio: user.bio || '',
      status: user.status || 'Активен'
    }
  });
});

app.post('/api/jobs', (req, res) => {
  const { title, company, city, type, category, salary, tags, createdBy } = req.body;

  if (!title || !city || !type || !category || !salary || !createdBy) {
    return res.status(400).json({ message: 'Заполните все обязательные поля' });
  }

  const users = getUsers();
  const user = users.find((item) => Number(item.id) === Number(createdBy));

  if (!user || !['employer', 'admin'].includes(user.role)) {
    return res.status(403).json({ message: 'Только работодатель или администратор может создавать вакансии' });
  }

  const jobs = getJobs();
  const parsedTags = Array.isArray(tags)
    ? tags
    : String(tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

  const newJob = {
    id: Date.now(),
    title,
    company: company || user.company || 'Компания',
    city,
    type,
    category,
    salary,
    tags: parsedTags,
    applicants: [],
    createdAt: Date.now()
  };

  jobs.unshift(newJob);
  saveJobs(jobs);

  res.status(201).json(newJob);
});

app.post('/api/jobs/:id/apply', (req, res) => {
  const { userId } = req.body;
  const jobId = Number(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: 'Необходим userId' });
  }

  const users = getUsers();
  const user = users.find((item) => Number(item.id) === Number(userId));

  if (!user || user.role !== 'student') {
    return res.status(403).json({ message: 'Подать заявку могут только студенты' });
  }

  const jobs = getJobs();
  const job = jobs.find((item) => Number(item.id) === jobId);

  if (!job) {
    return res.status(404).json({ message: 'Вакансия не найдена' });
  }

  const alreadyApplied = (job.applicants || []).some((applicant) => Number(applicant.userId) === Number(userId));

  if (alreadyApplied) {
    return res.status(409).json({ message: 'Вы уже откликались на эту вакансию' });
  }

  job.applicants = job.applicants || [];
  job.applicants.push({
    userId: Number(userId),
    name: user.name,
    email: user.email,
    appliedAt: Date.now()
  });

  saveJobs(jobs);

  res.json({
    success: true,
    message: 'Отклик успешно отправлен',
    applicantsCount: job.applicants.length
  });
});

app.listen(PORT, () => {
  console.log(`StudentJob production-style API running at http://localhost:${PORT}`);
});
