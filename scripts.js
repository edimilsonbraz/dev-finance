// MODAL
const Modal = { //Desenvolver este modal com TOGGLE()
    open() {
        //Abrir o modal
        //Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //Fechar o modal
        //remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Transaction = {
    all: [
        {
            description: 'Luiz',
            amount: -50012,
            date: '23/01/2021',
    
        },
        {
            description: 'Website',
            amount: 800000,
            date: '23/01/2021',
    
        },
        {
            description: 'Internet',
            amount: -20001,
            date: '23/01/2021',
    
        },
        {
            id: 4,
            description: 'App',
            amount: 600000,
            date: '23/01/2021',
    
        },
    ],

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        // pegar todas as transações
        // para cada transação,
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0 ) {
                // Somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })
        return income;

    },
    expenses() {
        let expense = 0;
        // pegar todas as transações
        // para cada transação,
        Transaction.all.forEach(transaction => {
            //se ela for menor que zero
            if( transaction.amount < 0 ) {
                // Somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })
        return expense;
    },
    total() {
        //entradas - saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Substituir os dados do HTML com os dados do JS
//Pegar as transações do Objeto aqui no Javascript e colocar lá no HTML

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"


        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" 
                alt="Remover transação">
            </td>
        </tr>
        `

        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes()) 
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

// Formata os valores
const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const App = {
    init() {

        // Adiciona as transações que já existe
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()

        
    },
    reload() {
        DOM.clearTransactions() // Limpa a Dom antes de iniciar novamente
        App.init()
    },
}

App.init()


