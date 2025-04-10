# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from .models import Event
import json

@csrf_exempt
def add_event(request):
    # return render(request, 'app/my_template.html')
    # return JsonResponse({'message': 'This is the endpoint'})
    # data = {request.body}
    # return JsonResponse(data, safe=False)
    # return JsonResponse({'Request body: ', request.body})

    # Query the Event table
    # events = Event.objects.all()
    # print(events)

    # # Or create a new event
    # new_event = Event.objects.create(
    #     Day=15,
    #     Month=4,
    #     Year=2025,
    #     EventName="Sample Event",
    #     TimeFrom="10:00",
    #     TimeTo="12:00"
    # )
    # print(new_event)

    if request.method == "POST":      
        try:
            # Check to see if data is retrieved
            print("Received data: ", request.body)

            # Parse the event data from the request
            data = json.loads(request.body)
        #     return JsonResponse({'data: ', data})

        # except json.JSONDecodeError:
        #     return JsonResponse({'error': 'Invalid JSON format'}, status=400)

            # day = data.get("Day")
            # month = data.get("Month")
            # year = data.get("Year")
            # title = data.get("EventName")
            # time_from = data.get("TimeFrom")
            # time_to = data.get("TimeTo")   
            
            # # Save to the database
            # event = Event.objects.create(
            #     Day=day,
            #     Month=month,
            #     Year=year,
            #     EventName = event_name,
            #     TimeFrom=time_from,
            #     TimeTo=time_to,
            # )

            # if not all([day, month, year, title, time_from, time_to]):
            #     return JsonResponse({'error': 'Missing required fields'}, status=400)

            # return JsonResponse({'Request body: ', data})

            return JsonResponse({"message": "Event has been added successfully!"}, status=201)
            # return JsonResponse({"message": "Event added successfully!", "event": {
            #     "id": event.event_id,  # Primary key (EventCode)
            #     "day": event.Day,
            #     "month": event.Month,
            #     "year": event.Year,
            #     "event_name": event.EventName,
            #     "time_from": event.TimeFrom,
            #     "time_to": event.TimeTo
            # }}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def fetch_events(request):
    if request.method == "GET":
        month = request.GET.get("month")
        year = request.GET.get("year")
        event = Event.objects.filter(month=month, year=year).values()
        return JsonResponse(list(event), safe=False)

