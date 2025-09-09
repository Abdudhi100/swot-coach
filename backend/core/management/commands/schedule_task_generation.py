from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, time, timedelta
from django_q.tasks import schedule
from django_q.models import Schedule

class Command(BaseCommand):
    help = "Create or ensure a daily schedule that runs generate_tasks_for_tomorrow"

    def handle(self, *args, **options):
        func_path = "core.services.generate_tasks_for_tomorrow"
        # don't create duplicate schedule if it exists
        if Schedule.objects.filter(func=func_path).exists():
            self.stdout.write(self.style.WARNING("Schedule already exists"))
            return

        now = timezone.localtime()
        # next run at 23:30 local time (adjust as you like)
        next_dt = timezone.make_aware(datetime.combine(now.date(), time(23, 30)))
        if next_dt <= now:
            next_dt += timedelta(days=1)

        schedule(func_path, schedule_type="D", next_run=next_dt, repeats=-1, name="generate_tasks_daily")
        self.stdout.write(self.style.SUCCESS(f"Scheduled {func_path} daily starting {next_dt}"))
