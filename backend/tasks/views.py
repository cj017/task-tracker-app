from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import RegisterForm
from django.contrib.auth.decorators import login_required
from .models import Project, Task



def register_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("dashboard")
    else:
        form = RegisterForm()

    return render(request, "tasks/register.html", {"form": form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("dashboard")
    else:
        form = AuthenticationForm()

    return render(request, "tasks/login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("login")


def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect("login")

    return render(request, "tasks/dashboard.html")

@login_required
def project_list(request):
    projects = Project.objects.filter(user=request.user)

    return render(
        request,
        "tasks/project_list.html",
        {"projects": projects}
    )


@login_required
def project_create(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")

        Project.objects.create(
            user=request.user,
            title=title,
            description=description
        )

        return redirect("project_list")

    return render(request, "tasks/project_create.html")


@login_required
def project_delete(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    if request.method == "POST":
        project.delete()
        return redirect("project_list")

    return render(
        request,
        "tasks/project_delete.html",
        {"project": project}
    )

@login_required
def project_update(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    if request.method == "POST":
        project.title = request.POST.get("title")
        project.description = request.POST.get("description")
        project.save()

        return redirect("project_list")

    return render(
        request,
        "tasks/project_update.html",
        {"project": project}
    )

@login_required
def task_list(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    tasks = project.tasks.all()

    return render(
        request,
        "tasks/task_list.html",
        {
            "project": project,
            "tasks": tasks,
        }
    )

@login_required
def task_create(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        status = request.POST.get("status")
        priority = request.POST.get("priority")
        due_date = request.POST.get("due_date")

        Task.objects.create(
            project=project,
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date or None,
        )

        return redirect("task_list", project_id=project.id)

    return render(
        request,
        "tasks/task_create.html",
        {"project": project}
    )

@login_required
def task_update(request, project_id, task_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    task = get_object_or_404(
        Task,
        id=task_id,
        project=project
    )

    if request.method == "POST":
        task.title = request.POST.get("title")
        task.description = request.POST.get("description")
        task.status = request.POST.get("status")
        task.priority = request.POST.get("priority")

        due_date = request.POST.get("due_date")
        task.due_date = due_date or None

        task.save()

        return redirect(
            "task_list",
            project_id=project.id
        )

    return render(
        request,
        "tasks/task_update.html",
        {
            "project": project,
            "task": task,
        }
    )

@login_required
def task_delete(request, project_id, task_id):
    project = get_object_or_404(
        Project,
        id=project_id,
        user=request.user
    )

    task = get_object_or_404(
        Task,
        id=task_id,
        project=project
    )

    if request.method == "POST":
        task.delete()

        return redirect(
            "task_list",
            project_id=project.id
        )

    return render(
        request,
        "tasks/task_delete.html",
        {
            "project": project,
            "task": task,
        }
    )