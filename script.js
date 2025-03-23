document.addEventListener("DOMContentLoaded", function () {
    // 日記機能
    document.getElementById('diaryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDiaryEntry();
    });

    function saveDiaryEntry() {
        const date = document.getElementById('date').value;
        const entry = document.getElementById('entry').value;
        
        if (!date || !entry) {
            alert("日付と日記を入力してください。");
            return;
        }
        
        const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        diaryEntries.push({ date, entry });
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        displayEntries();
    }

    function displayEntries() {
        const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        const diaryEntriesDiv = document.getElementById('diaryEntries');
        diaryEntriesDiv.innerHTML = '';

        diaryEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'diary-entry';
            entryDiv.textContent = `${entry.date}: ${entry.entry}`;
            diaryEntriesDiv.appendChild(entryDiv);
        });
    }

    displayEntries();

    // ToDoリスト機能
    document.getElementById('todoForm').addEventListener('submit', function (event) {
        event.preventDefault();
        addTodoItem();
    });

    function addTodoItem() {
        const todoInput = document.getElementById('todoInput').value;
        if (!todoInput) {
            alert("タスクを入力してください。");
            return;
        }

        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.push({ task: todoInput, completed: false });
        localStorage.setItem('todoList', JSON.stringify(todoList));
        displayTodoList();
    }

    function displayTodoList() {
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        const todoListDiv = document.getElementById('todoList');
        todoListDiv.innerHTML = '';

        todoList.forEach((item, index) => {
            const todoItemDiv = document.createElement('div');
            todoItemDiv.className = 'todo-item';
            todoItemDiv.innerHTML = `
                <input type="checkbox" class="todo-checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
                <span class="todo-text">${item.task}</span>
                <button class="btn btn-danger delete-todo" data-index="${index}">削除</button>
            `;
            todoListDiv.appendChild(todoItemDiv);
        });

        document.querySelectorAll('.delete-todo').forEach(button => {
            button.addEventListener('click', function () {
                deleteTodoItem(this.getAttribute('data-index'));
            });
        });
    }

    function deleteTodoItem(index) {
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.splice(index, 1);
        localStorage.setItem('todoList', JSON.stringify(todoList));
        displayTodoList();
    }

    displayTodoList();

    // データのエクスポート・インポート
    document.getElementById('exportData').addEventListener('click', function () {
        const data = {
            diaryEntries: JSON.parse(localStorage.getItem('diaryEntries')) || [],
            todoList: JSON.parse(localStorage.getItem('todoList')) || []
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'backup.json';
        a.click();
    });

    document.getElementById('importData').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem('diaryEntries', JSON.stringify(data.diaryEntries || []));
                localStorage.setItem('todoList', JSON.stringify(data.todoList || []));
                displayEntries();
                displayTodoList();
            } catch (error) {
                alert("無効なファイルです。");
            }
        };
        reader.readAsText(file);
    });
});