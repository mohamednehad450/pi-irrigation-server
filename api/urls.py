from django.urls import path, re_path
from . import views

urlpatterns = [

    # Catch all path: redirects to React frontend
    path('', views.frontend),
    re_path(r'^.*/$', views.frontend),
]
