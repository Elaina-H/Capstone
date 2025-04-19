# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from .models import Event
import json

@csrf_exempt
def add_event(request):

    if request.method == "POST":      
        try:
            data = json.loads(request.body) # Parse the event data from the request

            # create variables corresponding to body
            day = data.get('Day')
            month = data.get('Month')
            year = data.get('Year')
            title = data.get('EventName')
            time_from = data.get('TimeFrom')
            time_to = data.get('TimeTo')   
            
            # Save to the database
            event = Event.objects.create(
                Day=day,
                Month=month,
                Year=year,
                EventName = title,
                TimeFrom=time_from,
                TimeTo=time_to,
            )

            print("Created event:", event)
            print("Returning event_id:", event.event_id)

            # if not all([day, month, year, title, time_from, time_to]):
            #     return JsonResponse({'error': 'Missing required fields'}, status=400)

            # return JsonResponse({"message": "Event has been added successfully!"}, status=201)
            return JsonResponse({"message": "Event added successfully!", 
            "event": {
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
def delete_event(request, event_id):
    if request.method == "DELETE":
        try :
            # data = json.loads(request.body)
            # event_id = data.get(id = event_id)
            
            event_to_delete = Event.objects.get(event_id = event_id)
            event_to_delete.delete()
            # print(f"DELETE called for event_id: {event_id}")
            
            return JsonResponse({'message': 'Event deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Delete unsuccessful or event not found'}, status=404)
    return JsonResponse({'error: invalid request method.'}, status=405)




