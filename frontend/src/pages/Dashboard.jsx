import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import ExpenseChart from '../components/ExpenseChart'

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', date: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses')
      setExpenses(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await API.get('/expenses')
        setExpenses(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    loadExpenses()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/expenses', formData)
      setFormData({ title: '', amount: '', category: 'Food', date: '' })
      fetchExpenses()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`)
      fetchExpenses()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💸</span>
          <span className="text-lg font-bold text-gray-800">Expense Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, <span className="font-medium text-gray-700">{user?.name}</span></span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">₹{total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{expenses.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              ₹{expenses.length ? Math.round(total / expenses.length) : 0}
            </p>
          </div>
        </div>

        {/* Chart + Form side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Spending by Category</h2>
            <ExpenseChart expenses={expenses} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Add Expense</h2>
            <ExpenseForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Your Expenses</h2>
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        </div>

      </div>
    </div>
  )
}

export default Dashboard