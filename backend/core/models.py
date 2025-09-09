from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

User = settings.AUTH_USER_MODEL
# Create your models here.


class UserManager(BaseUserManager):
    use_in_migrations = True
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()




class SWOTItem(models.Model):
    TYPE_CHOICES = [
        ("strength", "Strength"),
        ("weakness", "Weakness"),
        ("opportunity", "Opportunity"),
        ("threat", "Threat"),
    ]
    FREQ_CHOICES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="swot_items")
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    description = models.CharField(max_length=255)
    frequency = models.CharField(max_length=12, choices=FREQ_CHOICES)
    # schedule controls:
    # dow_mask: 7-bit mask, Monday=0 .. Sunday=6 (default all days)
    dow_mask = models.SmallIntegerField(default=0b1111111)
    # day of month to generate for monthly/quarterly (1..31)
    month_day = models.PositiveSmallIntegerField(null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)



class Task(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("done", "Done"),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    swot_item = models.ForeignKey(SWOTItem, on_delete=models.CASCADE, related_name="tasks")
    date = models.DateField()
    label = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    # Optional check-in metric to “validate” completion (not required, but available)
    value = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)])
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [("owner", "swot_item", "date", "label")]
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.date} | {self.label} ({self.status})"


class Streak(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="streak")
    count = models.PositiveIntegerField(default=0)
    last_day = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.owner} streak={self.count}"
