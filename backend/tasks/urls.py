from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import TaskViewSet, RegisterView


# =========================
# TASK ROUTER
# =========================
router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="tasks")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
]

urlpatterns += router.urls
