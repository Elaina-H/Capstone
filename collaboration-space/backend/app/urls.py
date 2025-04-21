from django.urls import path
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path("logout/", views.LogOut, name="logout"),
    path('', views.home, name='home'),
    path('sign-up', views.sign_up, name='sign_up'),
    path('app/', login_required(TemplateView.as_view(template_name="build/index.html")), name="react_app"),

    path('api/add_event/', views.add_event, name='add_event'),
    path('api/fetch_events/', views.fetch_events, name='fetch_events'),
    path('api/delete_event/<int:event_id>/', views.delete_event, name ='delete_event'),
]
