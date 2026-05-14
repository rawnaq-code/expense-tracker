const categoryColors = {
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Health: 'bg-green-100 text-green-700',
  Other: 'bg-gray-100 text-gray-700',
}

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">🧾</div>
        <p className="text-sm">No expenses yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-3 font-medium">Title</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {expenses.map(expense => (
            <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 font-medium text-gray-800">{expense.title}</td>
              <td className="py-3 text-red-500 font-semibold">₹{expense.amount}</td>
              <td className="py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
              </td>
              <td className="py-3 text-gray-400">
                {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="py-3">
                <button
                  onClick={() => onDelete(expense._id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-lg"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList