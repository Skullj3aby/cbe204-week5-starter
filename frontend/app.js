
function renderTasks(tasks) {
    const list = document.querySelector("#taskList");

    list.innerHTML = "";
    tasks.forEach(task => {
        const item = document.createElement("div");
        item.textContent = `No. ${task.id}: ${task.title}`;
        list.appendChild(item);
    });
}

async function loadTasks() {
    const loadingMessage = document.querySelector("#loadingMessage");
    const errorMessage = document.querySelector("#errorMessage");
    const startTime = performance.now();

    loadingMessage.hidden = false;
    errorMessage.textContent = "";

    try {
        const response = await fetch("http://127.0.0.1:3000/api/tasks");
        const tasks = await response.json();

        console.log(tasks);
        renderTasks(tasks);
    } catch (error) {
        errorMessage.textContent = "Could not load tasks.";
        console.error(error);
    } finally {
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);

        await new Promise(resolve => setTimeout(resolve, remainingTime));
        loadingMessage.hidden = true;
    }
}

loadTasks();

const taskForm = document.querySelector("#taskForm");
taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title =
        document.querySelector("#taskTitle").value;

    // Send task to API
    console.log("Ready to send " + title);
    const response = await fetch("http://127.0.0.1:3000/api/tasks",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, completed: false })
        }
    );
    const tasks = await response.json();
    document.querySelector("#taskTitle").value = ""

    console.log(tasks);
    renderTasks(tasks);


});