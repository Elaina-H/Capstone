from django.urls import path
from . import views

urlpatterns = [
    path('add-event/', views.add_event, name='add_event'),
    path('fetch-events/', views.fetch_events, name='fetch_events'),
]
