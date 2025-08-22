from django.db import models

class Event(models.Model):
    event_id = models.AutoField(primary_key=True, db_column='EventCode', default=None)  
    Day = models.IntegerField()
    Month = models.IntegerField()
    Year = models.IntegerField()
    EventName = models.CharField(max_length=100)
    TimeFrom = models.TimeField()
    TimeTo = models.TimeField()
    RoomID = models.CharField(max_length=10)

    class Meta:
        db_table = 'events'

class Room(models.Model):
    room_id = models.AutoField(primary_key=True, db_column='RoomCodeID') 
    RoomCode = models.CharField(max_length=10)
    RoomURL = models.URLField()

    class Meta:
        db_table = 'room'

class Task(models.Model):
    task_id = models.AutoField(primary_key=True, db_column='TaskCode', default=None) 
    EventName = models.CharField(max_length=100)
    RoomID = models.CharField(max_length=10)

    class Meta:
        db_table = 'tasks'