# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from .models import Event
from .models import Room 
import json

@csrf_exempt
def add_event(request):

    if request.method == "POST":      
        try:
            data = json.loads(request.body) # Parse the event data from the request
            # Check to see if data is retrieved in terminal
            # print("Received data: ", request.body)
            # print("Title: ", data.get('EventName'))

            # create variables corresponding to body
            day = data.get('Day')
            month = data.get('Month')
            year = data.get('Year')
            title = data.get('EventName')
            time_from = data.get('TimeFrom')
            time_to = data.get('TimeTo')   
            # print(day, month, year, title, time_from, time_to)    # test accuracy
            
            # Save to the database
            event = Event.objects.create(
                Day=day,
                Month=month,
                Year=year,
                EventName = title,
                TimeFrom=time_from,
                TimeTo=time_to,
            )

            # if not all([day, month, year, title, time_from, time_to]):
            #     return JsonResponse({'error': 'Missing required fields'}, status=400)

            # return JsonResponse({"message": "Event has been added successfully!"}, status=201)
            return JsonResponse({"message": "Event added successfully!", "event": {
                "id": event.event_id,  # Primary key (EventCode)
                "day": event.Day,
                "month": event.Month,
                "year": event.Year,
                "event_name": event.EventName,
                "time_from": event.TimeFrom,
                "time_to": event.TimeTo
            }}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def fetch_events(request):
    if request.method == "GET":
        month = request.GET.get("month")
        year = request.GET.get("year")
        event = Event.objects.filter(Month=month, Year=year).values()
        return JsonResponse(list(event), safe=False)
@csrf_exempt   
def add_room(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body) # Parse the event data from the request
            print(f"Received data: {data}")  # Log the data to verify
            # Check to see if data is retrieved in terminal
            # print("Received data: ", request.body)
            # print("Title: ", data.get('EventName'))

            # create variables corresponding to body
            code = data.get('RoomCode')
            url = data.get('RoomURL')

              
            # print(day, month, year, title, time_from, time_to)    # test accuracy
            
            # Save to the database
            room = Room.objects.create(
                RoomCode = code,
                RoomURL = url,
            )

            # if not all([day, month, year, title, time_from, time_to]):
            #     return JsonResponse({'error': 'Missing required fields'}, status=400)

            # return JsonResponse({"message": "Event has been added successfully!"}, status=201)
            return JsonResponse({"message": "Room added successfully!", "room": {
                "id": room.room_id,  # Primary key 
                "code": room.RoomCode,
                "url": room.RoomURL
            }}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


