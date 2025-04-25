from django.db import models

class Event(models.Model):
    event_id = models.AutoField(primary_key=True, db_column='EventCode')
    Day = models.IntegerField()
    Month = models.IntegerField()
    Year = models.IntegerField()
    EventName = models.CharField(max_length=100)
    TimeFrom = models.TimeField()
    TimeTo = models.TimeField()

    class Meta:
        db_table = 'app_events'

# class Subevent(models.Model):
#     SubeventID = models.AutoField(primary_key=True, db_column = "SubeventID")
#     SubeventName = models.IntegerField()
#     EventCode = models.ForeignKey(Event, on_delete=models.CASCADE)

#     class Meta: 
#         db_table = 'Subevents'
