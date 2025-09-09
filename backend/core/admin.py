from django.contrib import admin
from .models import SWOTItem, Task, Streak, User

@admin.register(SWOTItem)
class SWOTItemAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "type", "description", "frequency", "active", "created_at")
    list_filter = ("type", "frequency", "active")
    search_fields = ("description", "owner__email")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "label", "date", "status", "completed_at")
    list_filter = ("status", "date")
    search_fields = ("label", "owner__email")

@admin.register(Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ("owner", "count", "last_day")

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "date_joined", "is_active", "is_staff")
    search_fields = ("email",)
