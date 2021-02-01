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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        // Transformando em Array de volta
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions)) 
        //transformando a transação em string
    }
}

const Transaction = {
    all: Storage.get(),

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"


        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" 
                alt="Remover transação">
            </td>
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
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100
       
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate [2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

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

const Form = {
    // Pegando os dados do HTML 
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // Verificar se todas as informçoes foram preenchidas
    validateFields() {
        const { description, amount, date } = Form.getValues()

        if(
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    // Formatar os dados para salvarizar
    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { 
            description, 
            amount, 
            date
        }
    },

    // Apagar os dados do formulario
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            // Adiciona uma transaction
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
            App.reload()
            
        } catch (error) {
            alert(error.message)
        }

        
    }
}

const App = {
    init() {

        // Adiciona as transações 
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
     // Atualiza a aplicação
    reload() {
        DOM.clearTransactions() 
        App.init()
    },
}

App.init()


