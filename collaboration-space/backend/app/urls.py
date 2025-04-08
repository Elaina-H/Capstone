from django.urls import path
from . import views

urlpatterns = [
    path('api/add_event/', views.add_event, name='add_event'),
    path('api/fetch_events/', views.fetch_events, name='fetch_events'),
]
