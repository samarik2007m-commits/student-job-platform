const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const usersDir = path.dirname(usersFilePath);

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([
    {
      id: 1,
      name: 'Demo Student',
      email: 'student@example.com',
      password: '123456',
      role: 'student',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      bio: 'Student in IT direction looking for internship and freelance work.',
      status: 'Ищет работу'
    }
  ], null, 2));
}

const jobs = [
  {
    id: 1,
    title: 'Junior Frontend Developer',
    company: 'Astra Digital',
    city: 'Москва',
    type: 'Полный день',
    category: 'development',
    salary: 'от 80 000 ₽',
    tags: ['React', 'JavaScript', 'Remote']
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Bright Media',
    city: 'Санкт-Петербург',
    type: 'Удалённо',
    category: 'marketing',
    salary: 'от 45 000 ₽',
    tags: ['SMM', 'SEO', 'Analytics']
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Pixel Studio',
    city: 'Казань',
    type: 'Стажировка',
    category: 'design',
    salary: 'от 50 000 ₽',
    tags: ['Figma', 'UX', 'Research']
  },
  {
    id: 4,
    title: 'Finance Analyst Intern',
    company: 'NovaCapital',
    city: 'Новосибирск',
    type: 'Частичная занятость',
    category: 'finance',
    salary: 'от 60 000 ₽',
    tags: ['Excel', 'Finance', 'Data']
  },
  {
    id: 5,
    title: 'Customer Support Specialist',
    company: 'HelioCare',
    city: 'Екатеринбург',
    type: 'Удалённо',
    category: 'support',
    salary: 'от 42 000 ₽',
    tags: ['Support', 'Chat', 'Client']
  },
  {
    id: 6,
    title: 'Backend Trainee',
    company: 'CoreStack',
    city: 'Моск��а',
    type: 'Тестовый проект',
    category: 'development',
    salary: 'от 70 000 ₽',
    tags: ['Node.js', 'API', 'SQL']
  }
];

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudentJob API is running' });
});

app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: 'student',
    skills: ['HTML', 'CSS'],
    bio: 'New student profile',
    status: 'Ищет работу'
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = getUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid login credentials' });
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      bio: user.bio,
      status: user.status
    }
  });
});

app.listen(PORT, () => {
  console.log(`StudentJob server running at http://localhost:${PORT}`);
});
