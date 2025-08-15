from django.urls import path
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path("logout/", views.LogOut, name="logout"),
    path('', views.home, name='home'),
    path('sign-up/', views.sign_up, name='sign_up'),
    path('app/', login_required(TemplateView.as_view(template_name="build/index.html")), name="react_app"),
    path('login/', LoginView.as_view(template_name='registration/login.html'), name='login'),

    path('api/add_event/', views.add_event, name='add_event'),
    path('api/fetch_events/', views.fetch_events, name='fetch_events'),
    path('api/fetch_events/<str:room_code>/', views.fetch_events_by_room),
    path('api/delete_event/<int:event_id>/', views.delete_event, name ='delete_event'),
    path('api/add_room/', views.add_room, name='add_room'),
    path('api/rooms/<str:room_code>/', views.get_rid, name='get_rid'),
]
