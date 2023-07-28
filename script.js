let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const expenseBtn = document.getElementById('expense-btn');
const incomeBtn = document.getElementById('income-btn');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const totalIncomeCell = document.getElementById('total-income');
const totalExpensesCell = document.getElementById('total-expenses');
const totalAnalysisCell = document.getElementById('total-analysis');
const analysisTab = document.getElementById('analysis-tab');
const expensesTab = document.getElementById('expenses-tab');
const analysisContent = document.getElementById('analysis');
const ctx = document.getElementById('analysisChart').getContext('2d');
let myPieChart; // Reference to the pie chart
let moneyType = 'expense'; // Default to expense

// Function to calculate and update the total amount
function updateTotalAmount() {
    totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountCell.textContent = totalAmount < 0 ? `-${Math.abs(totalAmount)}` : totalAmount;
}

// Function to update the analysis pie chart
function updateAnalysisChart() {
    let totalIncome = 0;
    let totalExpenses = 0;

    expenses.forEach((expense) => {
        if (expense.type === 'income') {
            totalIncome += expense.amount;
        } else {
            totalExpenses += expense.amount;
        }
    });

    const data = [totalIncome, totalExpenses];
    const labels = ['Income', 'Expenses'];
    const colors = ['#28a745', '#dc3545'];

    if (myPieChart) {
        myPieChart.data.datasets[0].data = data;
        myPieChart.update();
    } else {
        myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                }],
            },
        });
    }
}

// Function to update the analysis summary with total, income, and expenses
function updateAnalysisTab() {
    let totalIncome = 0;
    let totalExpenses = 0;

    expenses.forEach((expense) => {
        if (expense.type === 'income') {
            totalIncome += expense.amount;
        } else {
            totalExpenses += expense.amount;
        }
    });

    totalIncomeCell.textContent = totalIncome;
    totalExpensesCell.textContent = Math.abs(totalExpenses); // Update total expenses with the absolute value
    totalAnalysisCell.textContent = totalIncome - Math.abs(totalExpenses); // Corrected the total calculation
}

// Function to handle tab switching
function switchTabs(tab) {
    if (tab === 'expenses') {
        document.getElementById('expenses').style.display = 'block';
        analysisContent.style.display = 'none';
        expensesTab.classList.add('active');
        analysisTab.classList.remove('active');
    } else if (tab === 'analysis') {
        document.getElementById('expenses').style.display = 'none';
        analysisContent.style.display = 'block';
        expensesTab.classList.remove('active');
        analysisTab.classList.add('active');

        updateAnalysisChart();
        updateAnalysisTab();
    }
}

// Event listeners for tab switching
expensesTab.addEventListener('click', function () {
    switchTabs('expenses');
});

analysisTab.addEventListener('click', function () {
    switchTabs('analysis');
});

// Function to add a new expense/income
addBtn.addEventListener('click', function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount === 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { category, amount: moneyType === 'expense' ? -amount : amount, date, type: moneyType };
    expenses.push(expense);

    const newRow = expenseTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const typeCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        expenses.splice(expenses.indexOf(expense), 1);
        expenseTableBody.removeChild(newRow);
        updateTotalAmount();
        updateAnalysisChart();
        updateAnalysisTab();
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = Math.abs(expense.amount); // Display absolute value for individual expenses
    dateCell.textContent = expense.date;
    typeCell.textContent = expense.type;
    deleteCell.appendChild(deleteBtn);

    updateTotalAmount();
    updateAnalysisChart();
    updateAnalysisTab();
});

// Event listeners for expense/income buttons
expenseBtn.addEventListener('click', function () {
    moneyType = 'expense';
    expenseBtn.classList.add('active');
    incomeBtn.classList.remove('active');
});

incomeBtn.addEventListener('click', function () {
    moneyType = 'income';
    incomeBtn.classList.add('active');
    expenseBtn.classList.remove('active');
});

// Initialize the app by showing the Expenses tab
switchTabs('expenses');
