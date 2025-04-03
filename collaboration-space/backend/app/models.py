from django.db import models

class Event(models.Model):
    day = models.IntegerField()
    month = models.IntegerField()
    year = models.IntegerField()
    title = models.CharField(max_length=100)
    time_from = models.TimeField()
    time_to = models.TimeField()

    class Meta:
        db_table = 'Events'