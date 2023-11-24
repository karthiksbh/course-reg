
from rest_framework import serializers
from .models import User,Course

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'is_fac',
                  'reg_no', 'password','ph_no','year','sem')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user_det = self.Meta.model(**validated_data)

        if password is not None:
            user_det.set_password(password)
        user_det.save()

        return user_det

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['reg_no', 'email', 'first_name', 'last_name', 'year', 'ph_no', 'sem','is_fac']
    

class CourseSerializer(serializers.Serializer):
    course_name = serializers.CharField(source='course_ref__course_name')
    credits = serializers.IntegerField(source='course_ref__credits')
    year = serializers.IntegerField(source='course_ref__year')
    sem = serializers.IntegerField(source='course_ref__sem')
    course_code = serializers.CharField(source='course_ref__course_code')
    
class Courseserializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CoursesSerializer(serializers.ModelSerializer):
    is_registered = serializers.BooleanField()

    class Meta:
        model = Course
        fields = ['id', 'course_name', 'credits', 'year', 'sem', 'is_registered','course_code']
