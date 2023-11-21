from django.contrib import admin
from .models import User,Course,Registration

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Registration)