# BudgetWise - Personal Finance Management Application

![BudgetWise Logo](https://via.placeholder.com/150x50?text=BudgetWise)

BudgetWise is a comprehensive personal finance management application that helps users track expenses, manage budgets, and gain insights into their spending habits. Built with a modern tech stack including React, Node.js, Express, and MongoDB, this application provides a user-friendly interface for financial management.

## 🌟 Features

### Transaction Management

- Add, edit, and delete financial transactions
- Categorize transactions for better organization
- View transaction history with filtering and sorting options

### Financial Dashboard

- Get a quick overview of your financial status
- View summary cards with key financial metrics
- Visualize spending patterns with interactive charts

### Budget Management

- Set monthly budgets for different spending categories
- Track budget vs. actual spending
- Receive insights and recommendations based on spending patterns

### Data Visualization

- Monthly expenses chart to track spending over time
- Category pie chart to understand spending distribution
- Budget comparison charts to monitor budget adherence

## 🚀 Tech Stack

### Frontend

- React 19
- Vite
- TailwindCSS
- Lucide React (for icons)
- Recharts (for data visualization)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### Clone the repository

```bash
git clone https://github.com/Rohit1419/BudgetWise.git
cd BudgetWise
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```
MONGO_URL=your_mongodb_connection_string
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

1. **Dashboard**: View your financial overview, recent transactions, and spending charts
2. **Transactions**: Manage all your financial transactions
3. **Budget**: Set and track your monthly budgets by category
4. **Reports**: Analyze your spending patterns and financial trends

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚢 Deployment

The application can be deployed on Vercel:

### Backend Deployment

1. Create a `vercel.json` file in the backend directory
2. Configure environment variables in Vercel dashboard
3. Deploy using Vercel CLI or GitHub integration

### Frontend Deployment

1. Configure API URL environment variable
2. Deploy using Vercel CLI or GitHub integration

## 📝 Project Structure

```
budgetwise/
├── backend/                # Backend server code
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── db/             # Database connection
│   │   ├── app.js          # Express app setup
│   │   └── index.js        # Server entry point
│   └── package.json
│
└── frontend/               # Frontend React application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Application pages
    │   ├── services/       # API service functions
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Entry point
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

- **Rohit Gite** - [GitHub Profile](https://github.com/Rohit1419)

## 🙏 Acknowledgements

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

Made with ❤️ by Rohit Gite
