$(function () {
    //Applicacao JQuery + Ajax

    var form = $(".form");
    var inputTitle = $("#taskTitle");
    var inputDescription = $("#taskDescription");
    var list = $(".task-list");
    var url = "http://localhost:3000";

    // metodo para carregar as tarefas
    function loadTasks() {

        $.ajax({
            method: "GET",
            url: url + "/tarefas",
            dataType: "json"
        }).done(function (response) {
            list.empty();
            insertTasks(response);

        })
            .fail(function (error) {
                console.log(error);
            })
    }

    // chamada do metodo para carregar as tarefas
    loadTasks();


    // metodo para inserir tarefas
    function insertTasks(tasks) {
        tasks.forEach(function (e) {
            var li = $(`<li class="task">
<div class="task-content">
                <h3 class="task-title">${e.title}</h3>
                <p class="task-description">${e.description}</p>
            </div>
            <button class="btn-edit" data-id="${e.id}">Editar</button>
            <button class="btn-delete" data-id="${e.id}">Excluir</button>
        </li>`);
            list.append(li);
        })
    }

    // metodo para adicionar tarefas
    function addTask(title, description) {
        var film = {
            "title": title,
            "description": description
        };
        $.ajax({
            method: "POST",
            url: url + "/tarefas",
            dataType: "json",
            data: film
        }).done(function (response) {
            loadTasks();
        })
            .fail(function (error) {
                console.log(error);
            })


    }


    form.on("submit", function (e) {
        e.preventDefault();
        addTask(inputTitle.val(), inputDescription.val());
        inputTitle.val("");
        inputDescription.val("");
    });

    // metodo para remover tarefa
    function removeTask(id) {
        $.ajax({
            method: "DELETE",
            url: url + "/tarefas/" + id,
            dataType: "json",
        }).done(function (response) {
            loadTasks();
        })
            .fail(function (error) {
                console.log(error);
            })

    }

    list.on("click", ".btn-delete", function () {
        var id = $(this).data("id");
        removeTask(id);

    });

    // metodo para atualizar tarefa
    function updateTask(id, title, description) {

        var film = {
            "title": title,
            "description": description
        };
        $.ajax({
            method: "PATCH",
            url: url + "/tarefas/" + id,
            dataType: "json",
            data: film
        }).done(function (response) {
            loadTasks()

        })
            .fail(function (error) {
                console.log(error);
            });

    }


    // implementacao da lista de tarefas cadastradas
    list.on("click", ".btn-edit", function (e) {
        e.preventDefault();


        var titleToEdit = $(this).parent().find(".task-title");
        var descriptionToEdit = $(this).parent().find(".task-description");

        $(this).toggleClass("editable");

        if ($(this).hasClass("editable")) {
            var titleToEditText = titleToEdit.text();
            var descriptionToEditText = descriptionToEdit.text();


            titleToEdit.replaceWith(`<input type="text" class="task-title" value="${titleToEditText}" />`);

            descriptionToEdit.replaceWith(`<input type="text" class="task-description" value="${descriptionToEditText}" />`);

            $(this).text("Salvar");

        }
        else{
            var modId = $(this).data("id");
            var thisTitle = titleToEdit.val();
            var thisDesc= descriptionToEdit.val();

            titleToEdit.replaceWith(` <h3 class="task-title">${thisTitle}</h3>`);
            descriptionToEdit.replaceWith(`<p class="task-description">${thisDesc}</p>`);

            updateTask(modId, thisTitle, thisDesc);
            $(this).text("Editar");

        }

    });

});

