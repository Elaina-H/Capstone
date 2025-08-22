from django.shortcuts import render, redirect
from .forms import RegisterForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse
from .models import Event, Room, Task
from django.views.decorators.csrf import csrf_exempt
import json

# @login_required(login_url='/login')
def home(request):
    return redirect('/app/')


def LogOut(request):
    logout(request)
    return redirect('/login/')

def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/login/')
    else:
        form = RegisterForm()

    return render(request, 'registration/sign_up.html', {"form": form}) 

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
            room = data.get('RoomID')   
            
            # Save to the database
            event = Event.objects.create(
                Day=day,
                Month=month,
                Year=year,
                EventName = title,
                TimeFrom=time_from,
                TimeTo=time_to,
                RoomID = room,
            )

            
            # for testing
            print("Created event:", event)
            print("Returning event_id:", event.event_id)
            

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

@csrf_exempt
def add_task(request):
    if request.method == "POST":
        try:
            #get data from JSON 
            data = json.loads(request.body)
            title = data.get('EventName')
            room = data.get('RoomID')   

            #save to DB 
            task = Task.objects.create(
                EventName = title,
                RoomID = room,
            )
            # for testing
            print("Created Task:", task)
            print("Returning task ID:", task.task_id)
            return JsonResponse({"message": "Task added successfully!",
            "task": {
                "id": task.task_id, #TaskCode
                "task_name": task.EventName,
            }}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def fetch_events(request):
    print(">>> fetch_events called with:")
    if request.method == "GET":
        month = request.GET.get("month")
        year = request.GET.get("year")
        room_code = request.GET.get("roomCode")
        event = Event.objects.filter(Month=month, Year=year, RoomID=room_code).values()
        return JsonResponse(list(event), safe=False)
    
def fetch_events_by_room(request, room_code):
    print(">>> fetch_events_by_room called with:", room_code)
    if request.method == "GET":
        try:
            room = Room.objects.get(RoomCode=room_code)
            roomid = room.room_id
            events = Event.objects.filter(RoomID=roomid).values()
            return JsonResponse(list(events), safe=False)
        except Room.DoesNotExist:
            return JsonResponse({"error": "Room not found"}, status=404)
        
def fetch_tasks_by_room(request, room_code):
    if request.method == "GET":
        try:
            room = Room.objects.get(RoomCode=room_code)
            roomid = room.room_id
            tasks = Task.objects.filter(RoomID=roomid).values()
            return JsonResponse(list(tasks), safe=False)
        except Room.DoesNotExist:
            return JsonResponse({"error": "Room not foud"}, status=404)
    


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

def delete_task(request, task_id):
    if request.method == "DELETE":
        try:
            task_to_delete = Task.objects.get(task_id = task_id)
            task_to_delete.delete()
            return JsonResponse({'message': 'Task deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Task failed to delete or not found'}, status=404)
    return JsonResponse({'error': 'invalid request method'},status=405)

@csrf_exempt
def add_room(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body) # Parse the event data from the request
            print(f"Received data: {data}")  # Log the data to verify

            code = data.get('RoomCode')
            url = data.get('RoomURL')

            room = Room.objects.create(
                RoomCode = code,
                RoomURL = url,
            )

            return JsonResponse({"message": "Room added successfully!", "room": {
                "id": room.room_id,  # Primary key 
                "code": room.RoomCode,
                "url": room.RoomURL
            }}, status=201)
        except Exception as e:
            import traceback
            print("Error adding room:", str(e))
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt 
def get_rid(request, room_code):
    if request.method == "GET":
        try:
            roomid = Room.objects.get(RoomCode=room_code)
            return JsonResponse({'RoomID': roomid.room_id})
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room not found'}, status=404)
