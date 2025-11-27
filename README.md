# Todo App - Task Management Made Easy

A beautiful, mobile-first task management application built with React, Express, and MongoDB. Create, organize, and track your daily tasks with an intuitive interface.

## ✨ Features

- **Weekly Calendar** - Click any date to view tasks for that day
- **Task Management** - Create, edit, delete, and complete tasks
- **Time Scheduling** - Set start and end times for each task
- **Task Search** - Quickly find tasks by title or description
- **Weekly Progress** - Track your task completion rate for the week
- **Dark/Light Mode** - Switch between light and dark themes (saves preference)
- **Mobile-Friendly** - Fully responsive design works on phones, tablets, and desktop
- **Persistent Storage** - All tasks saved to MongoDB Atlas cloud database

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git

### Local Installation

1. **Clone the repository**
```bash
git clone https://github.com/Somruproy7/todo-app.git
cd todo-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env.local` file** in the root directory:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydb?appName=Cluster0
```
Replace with your actual MongoDB Atlas connection string.

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5000`

---

## 📖 How to Use

### Creating a Task
1. Click the **blue plus button** at the bottom center
2. Enter task title (required)
3. Set start and end times
4. Add description (optional)
5. Click **"Create task"**

### Viewing Tasks by Date
1. Look at the **weekly calendar** at the top
2. Click any date to see tasks for that day
3. Current day is highlighted with a light blue background
4. Selected day is highlighted in blue

### Managing Tasks
- **Complete Task**: Click the checkbox next to task title
- **Edit Task**: Click the pencil icon
- **Delete Task**: Click the trash icon
- **Search Tasks**: Click search icon, type to find tasks

### Checking Progress
- Look at **Weekly Progress** widget below the task list
- Shows completed vs pending tasks this week
- Progress bar indicates completion percentage

### Switching Themes
1. Click **settings icon** (gear) in top-right
2. Choose **Light** or **Dark** mode
3. Your preference is saved automatically

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Beautiful components
- **React Query** - Data management
- **React Hook Form** - Form handling
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - REST API framework
- **TypeScript** - Type safety

### Database
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - Database modeling

---

## 📦 Project Structure

```
todo-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Vite integration
├── shared/               # Shared types
│   └── schema.ts         # Data schemas
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
└── vite.config.ts        # Vite config
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Used in This Project)

1. **Sign up** at https://cloud.mongodb.com
2. **Create a cluster** (free M0 tier available)
3. **Create database user** with username and password
4. **Get connection string** in format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mydb?appName=Cluster0
   ```
5. **Add to `.env.local`** as `MONGODB_URI`

Your database name: `mydb`
Your collection name: `tasks`

---

## 🌐 Deployment to AWS

### Option 1: AWS App Runner (Recommended - Easiest)

1. **Push code to GitHub**
   ```bash
   git init
   git config user.name "Your Name"
   git config user.email "your-email@example.com"
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/todo-app.git
   git push -u origin main
   ```

2. **In AWS Console**
   - Go to **App Runner**
   - Click **Create service**
   - Connect GitHub account
   - Select your repository
   - Set **Port: 5000**
   - Add environment variable `MONGODB_URI`
   - Click **Create and deploy**

3. **Your app will be live** with a public URL!

### Option 2: Elastic Beanstalk

See `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📱 API Endpoints

All endpoints return JSON and require the backend to be running.

### Tasks
- `GET /api/tasks` - Get all tasks (or filter by date)
  - Query: `?date=2024-01-15`
  
- `GET /api/tasks/:id` - Get specific task

- `POST /api/tasks` - Create new task
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "date": "2024-01-15",
    "startTime": "09:00",
    "endTime": "10:00",
    "completed": false
  }
  ```

- `PATCH /api/tasks/:id` - Update task

- `DELETE /api/tasks/:id` - Delete task

### Statistics
- `GET /api/tasks/stats` - Get weekly statistics
  - Query: `?startDate=2024-01-08&endDate=2024-01-14`
  - Returns: `{ completed, pending, total }`

---

## 🔒 Security Notes

- Never commit `.env.local` to Git
- Use `.gitignore` to exclude sensitive files
- MongoDB credentials are stored as environment variables
- All data is encrypted in transit (HTTPS)

---

## 🐛 Troubleshooting

**Tasks not saving?**
- Check MONGODB_URI is correct in environment variables
- Ensure MongoDB Atlas cluster is running
- Check network connectivity to MongoDB

**App won't start?**
- Make sure port 5000 is not in use
- Run `npm install` to install all dependencies
- Check Node.js version (18+ required)

**Dark mode not working?**
- Check browser LocalStorage is enabled
- Try clearing browser cache
- Refresh the page

---

## 📝 Environment Variables

Create `.env.local` file with:
```
MONGODB_URI=your_mongodb_connection_string_here
```

---

## 💡 Tips & Tricks

- **Quick task creation**: Use the plus button to create a task quickly
- **Organize by date**: Click different dates to focus on specific days
- **Dark mode**: Perfect for night-time task management
- **Search feature**: Great for finding old tasks
- **Track progress**: Weekly stats help you stay motivated

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Built By

Somruproy7 - Full-stack developer

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints
3. Check MongoDB Atlas dashboard for database status

---

**Happy task management!** 🎯
