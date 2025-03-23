(function() {
// DOM読み込み後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('diaryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDiaryEntry();
    });

    document.getElementById('deleteAllButton').addEventListener('click', function () {
        if (confirm("すべての日記が削除されます。よろしいですか？")) {
            localStorage.removeItem('diaryEntries');
            displayEntries();
            document.getElementById('message').innerText = 'すべての日記が削除されました。';
        }
    });

    document.getElementById('deleteAllTodosButton').addEventListener('click', function () {
        if (confirm("すべてのタスクが削除されます。よろしいですか？")) {
            localStorage.removeItem('todoList');
            displayTodoList();
        }
    });

    // 初期化処理
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    document.getElementById('todoDate').value = today;

    displayEntries();
    displayTodoList();
});

let isEditing = false;
let editingIndex = null;

function saveDiaryEntry() {
    const date = document.getElementById('date').value;
    const weather = document.getElementById('weather').value;
    const mood = document.getElementById('mood').value;
    const entry = document.getElementById('entry').value.trim();

    if (!date || !entry) {
        alert("日付と日記は必須です。");
        return;
    }

    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const diaryEntry = { date, weather, mood, entry };

    if (isEditing) {
        entries[editingIndex] = diaryEntry;
    } else {
        entries.push(diaryEntry);
    }
    localStorage.setItem('diaryEntries', JSON.stringify(entries));

    displayEntries();
    clearDiaryForm();

    isEditing = false;
    editingIndex = null;

    document.getElementById('message').innerText = isEditing ? '日記が修正されました！' : '日記が保存されました！';
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const diaryEntriesDiv = document.getElementById('diaryEntries');
    diaryEntriesDiv.innerHTML = '';

    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'diary-entry';
        entryDiv.innerHTML = `
            <strong>${entry.date}</strong> - ${entry.weather} - ${entry.mood}
            <p>${entry.entry}</p>
            <button class="btn btn-secondary edit-entry" data-index="${index}">編集</button>
            <span class="button-space"></span>
            <button class="btn btn-danger delete-entry" data-index="${index}">削除</button>
        `;
        diaryEntriesDiv.appendChild(entryDiv);
    });

    document.querySelectorAll('.edit-entry').forEach(button => {
        button.addEventListener('click', (event) => {
            editEntry(parseInt(event.target.getAttribute('data-index')));
        });
    });

    document.querySelectorAll('.delete-entry').forEach(button => {
        button.addEventListener('click', (event) => {
            deleteEntry(parseInt(event.target.getAttribute('data-index')));
        });
    });
}

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const entry = entries[index];

    document.getElementById('date').value = entry.date;
    document.getElementById('weather').value = entry.weather;

    // 感情の選択肢を適切に設定
    const moodSelect = document.getElementById('mood');
    for (let i = 0; i < moodSelect.options.length; i++) {
        if (moodSelect.options[i].value.includes(entry.mood)) {
            moodSelect.selectedIndex = i;
            break;
        }
    }

    document.getElementById('entry').value = entry.entry;

    isEditing = true;
    editingIndex = index;
}

function deleteEntry(index) {
    if (confirm("この日記を削除しますか？")) {
        let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
        entries.splice(index, 1);
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        displayEntries();
    }
}

})();