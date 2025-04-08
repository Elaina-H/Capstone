# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
from .models import Event
import json

def add_event(request):
    # return render(request, 'app/my_template.html')
    # return JsonResponse({'message': 'This is the endpoint'})
    # data = {request.body}
    # return JsonResponse(data, safe=False)
    # return JsonResponse({'Request body: ', request.body})

    if request.method == "POST":      
        try:
            # Parse the event data from the request
            data = json.loads(request.body)
            return JsonResponse({'data: ', data})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

            day = data.get("day")
            month = data.get("month")
            year = data.get("year")
            title = data.get("title")
            time_from = data.get("time_from")
            time_to = data.get("time_to")   
            
            # Save to the database
            Events.objects.create(
                day=day,
                month=month,
                year=year,
                title=title,
                time_from=time_from,
                time_to=time_to,
            )

            if not all([day, month, year, title, time_from, time_to, test]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            # return JsonResponse({'Request body: ', data})

    #         return JsonResponse({"message": "Event added successfully!"}, status=201)
        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

def fetch_events(request):
    if request.method == "GET":
        month = request.GET.get("month")
        year = request.GET.get("year")
        event = Event.objects.filter(month=month, year=year).values()
        return JsonResponse(list(event), safe=False)

