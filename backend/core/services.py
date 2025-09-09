from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from .models import SWOTItem, Task, Streak


# -------------------
# Streak handling
# -------------------

def update_streak_for_user(user):
    """Update streak when the user completes a task today."""
    today = timezone.localdate()
    streak, _ = Streak.objects.get_or_create(owner=user)

    if streak.last_day == today:
        # Already counted today
        return streak

    if streak.last_day == today - timedelta(days=1):
        streak.count += 1
    else:
        # Reset or start new streak
        streak.count = 1

    streak.last_day = today
    streak.save()
    return streak


# -------------------
# Task generation rules
# -------------------

def _quarter_of(month: int) -> int:
    return (month - 1) // 3 + 1


def should_create_for(swot: SWOTItem, target_date: timezone.datetime.date) -> bool:
    """Check if a SWOT item should generate a task on the given date."""
    freq = swot.frequency
    created = swot.created_at.date()

    if freq == "daily":
        return True

    if freq == "weekly":
        weekday = target_date.weekday()  # 0=Mon, 6=Sun
        if swot.dow_mask:  # user picked weekdays
            return (swot.dow_mask >> weekday) & 1 == 1
        return weekday == created.weekday()  # fallback

    if freq == "monthly":
        day = swot.month_day or created.day
        return target_date.day == day

    if freq == "quarterly":
        day = swot.month_day or created.day
        return (
            target_date.day == day
            and _quarter_of(target_date.month) == _quarter_of(created.month)
        )

    return False


# -------------------
# Task generation (batch + per item)
# -------------------

def generate_label(swot: SWOTItem) -> str:
    """Generate the task label from SWOT type + description."""
    return swot.description if swot.type != "threat" else f"avoid: {swot.description}"


@transaction.atomic
def generate_tasks_for_date(target_date):
    """
    Generate tasks for ALL active SWOT items for a specific date.
    Safe to call repeatedly (idempotent).
    """
    created_count = 0
    swots = SWOTItem.objects.select_related("owner").filter(active=True)

    for sw in swots:
        try:
            if not should_create_for(sw, target_date):
                continue

            _, created = Task.objects.get_or_create(
                owner=sw.owner,
                swot_item=sw,
                date=target_date,
                defaults={"label": generate_label(sw), "status": "pending"},
            )
            if created:
                created_count += 1
        except Exception:
            # One broken item shouldn’t stop the batch
            continue

    return created_count


def generate_tasks_for_swot_item(swot_item, date):
    """
    Generate today's task(s) for a single SWOT item only.
    Used when a new SWOT is added so the dashboard updates instantly.
    """
    if should_create_for(swot_item, date):
        task, created = Task.objects.get_or_create(
            owner=swot_item.owner,
            swot_item=swot_item,
            date=date,
            defaults={"label": generate_label(swot_item), "status": "pending"},
        )
        return 1 if created else 0
    return 0


def generate_tasks_for_tomorrow():
    """Helper for nightly scheduler: generate tomorrow’s tasks for all SWOTs."""
    target = timezone.localdate() + timedelta(days=1)
    return generate_tasks_for_date(target)
