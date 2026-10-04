from django.urls import path

from clinic import views

urlpatterns = [
    path("", views.index),
    path("me", views.me),
]
