# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
from .models import Event
import json

def add_event(request):
    if request.method == "POST":
        try:
            # Parse the event data from the request
            data = json.loads(request.body)
            day = data.get("day")
            month = data.get("month")
            year = data.get("year")
            title = data.get("title")
            time_from = data.get("time_from")
            time_to = data.get("time_to")
            
            # Save to the database
            Event.objects.create(
                day=day,
                month=month,
                year=year,
                title=title,
                time_from=time_from,
                time_to=time_to,
            )

            return JsonResponse({"message": "Event added successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

def fetch_events(request):
    if request.method == "GET":
        month = request.GET.get("month")
        year = request.GET.get("year")
        eventObjects = Event.objects.filter(month=month, year=year).values()
        return JsonResponse(list(eventObjects), safe=False)

