from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_superuser(self, reg_no, first_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'is_staff must be True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'is_superuser must be true')
        return self.create_user(reg_no, first_name, password, **other_fields)

    def create_user(self, reg_no, first_name, password, **other_fields):
        if not reg_no:
            raise ValueError(_('Reg No is required for creating the user'))
        user = self.model(reg_no=reg_no,
                          first_name=first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    reg_no = models.CharField(max_length=255,unique=True)
    email = models.EmailField(_('Email Address'), unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_fac = models.BooleanField(default=False)
    year = models.IntegerField(null=True, blank=True)
    ph_no = models.CharField(max_length=15,null=True, blank=True)
    sem = models.IntegerField(null=True,blank=True)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'reg_no'
    REQUIRED_FIELDS = ['first_name']

    def __str__(self):
        return str(self.reg_no)

import uuid

class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course_name = models.CharField(max_length=255)
    credits = models.IntegerField()
    year = models.IntegerField()
    sem = models.IntegerField()

    def __str__(self):
        return str(self.id)

class Registration(models.Model):
    user_ref = models.ForeignKey(User, related_name='registrations',on_delete=models.CASCADE)
    course_ref = models.ForeignKey(Course, related_name='registrations',on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.id)