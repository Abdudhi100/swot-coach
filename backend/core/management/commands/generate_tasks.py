from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from core.services import generate_tasks_for_date

class Command(BaseCommand):
    help = "Generate tasks for a date (default: tomorrow)"

    def add_arguments(self, parser):
        parser.add_argument("--date", type=str, help="YYYY-MM-DD (default: tomorrow)")

    def handle(self, *args, **options):
        if options.get("date"):
            target = datetime.strptime(options["date"], "%Y-%m-%d").date()
        else:
            target = timezone.localdate() + timedelta(days=1)
        created = generate_tasks_for_date(target)
        self.stdout.write(self.style.SUCCESS(f"Generated {created} tasks for {target}"))
