from django.db import models

class Event(models.Model):
    event_id = models.AutoField(primary_key=True, db_column='EventCode')  # Use your actual primary key column here
    Day = models.IntegerField()
    Month = models.IntegerField()
    Year = models.IntegerField()
    EventName = models.CharField(max_length=100)
    TimeFrom = models.TimeField()
    TimeTo = models.TimeField()

    class Meta:
        db_table = 'app_events'

