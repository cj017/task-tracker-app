from django.urls import path

from .views import (
    project_create,
    project_delete,
    project_list,
    project_update,
    register_view,
    login_view,
    logout_view,
    dashboard_view,
)


urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("", dashboard_view, name="dashboard"),
    path("projects/", project_list, name="project_list"),
    path("projects/create/", project_create, name="project_create"),
    path("projects/<int:project_id>/delete/", project_delete, name="project_delete"),
    path("projects/<int:project_id>/edit/", project_update, name="project_update"),
]