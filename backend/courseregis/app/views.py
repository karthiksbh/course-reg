from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer,UserProfileSerializer,CourseSerializer,CoursesSerializer,Courseserializer
from .models import User,Registration,Course
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class RegisterView(APIView):
    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newUser = reg_serializer.save()
            if newUser:
                return Response({'message': 'Created user successfully'}, status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        try:
            reg_no = request.data['reg_no']
            password = request.data['password']

            user = User.objects.filter(reg_no=reg_no).first()
            if user is None:
                return Response({'Error': 'User Not Found'}, status=404)
            if not user.check_password(password):
                return Response({'Error': 'Password Incorrect'}, status=401)

            refresh = RefreshToken.for_user(user)
            if(user.is_fac is True):
                response = Response({'isFac': True, 'firstName': user.first_name, 'lastName': user.last_name, 'access_token': str(
                    refresh.access_token), 'refresh_token': str(refresh)}, status=200)
            else:
                response = Response({'isFac': False, 'firstName': user.first_name, 'lastName': user.last_name, 'access_token': str(
                    refresh.access_token), 'refresh_token': str(refresh)}, status=200)
            return response

        except Exception as e:
            return Response({'Error': str(e)})

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class StudentCoursesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_fac:
            return Response({"detail": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)
        reg_no = request.query_params.get('reg_no', None)

        if not reg_no:
            return Response({"detail": "Registration number (reg_no) is required as a query parameter."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            student = User.objects.get(reg_no=reg_no)
        except User.DoesNotExist:
            return Response({"detail": f"Student with registration number {reg_no} not found."},
                            status=status.HTTP_404_NOT_FOUND)
        print(student)
        registrations = Registration.objects.filter(user_ref=student)
        courses = registrations.values('course_ref__course_name', 'course_ref__credits', 'course_ref__year', 'course_ref__sem')
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

from django.db.models import Exists, OuterRef

class CoursesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the current user's year and semester
            current_user_year = request.user.year
            current_user_sem = request.user.sem
            print(request.user)
            courses = Course.objects.filter(year=current_user_year, sem=current_user_sem)

            courses = courses.annotate(
                is_registered=Exists(
                    Registration.objects.filter(
                        user_ref=request.user,
                        course_ref=OuterRef('id')
                    )
                )
            )

            serializer = CoursesSerializer(courses, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterCourseAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        try:
            user = request.user
            course_id = request.data.get("course_id")
            course_id = Course.objects.get(id=course_id)
            reg = Registration.objects.create(user_ref=user,course_ref=course_id)
            reg.save()
            return Response({'message':'Course Registered Successfully'},status=200)
        except Exception as e:
            return Response({'error':str(e)},status=400)
    
class StudentRegisteredCourses(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            registrations = Registration.objects.filter(user_ref=user)
            courses = [registration.course_ref for registration in registrations]
            print(courses)
            serializer = Courseserializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserCoursesInYearSem(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        year = request.data.get('year')
        sem = request.data.get('sem')

        if year is None or sem is None:
            return Response({'error': 'Year and Sem are required in the request data.'}, status=status.HTTP_400_BAD_REQUEST)

        registrations = Registration.objects.filter(user_ref=user, course_ref__year=year, course_ref__sem=sem)
        courses = [registration.course_ref for registration in registrations]
        serializer = Courseserializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CourseSearchView(APIView):
    def post(self, request):
        try:
            year = request.data.get('year')
            sem = request.data.get('sem')

            if not year or not sem:
                return Response({'error': 'Both year and sem parameters are required.'}, status=status.HTTP_400_BAD_REQUEST)

            courses = Course.objects.filter(year=year, sem=sem)
            serializer = Courseserializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentSearchAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_fac:
            return Response({"detail": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)
            
        course_id = request.data.get('course_id')

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."},
                            status=status.HTTP_404_NOT_FOUND)

        registrations = Registration.objects.filter(course_ref=course)
        students_registered = [registration.user_ref for registration in registrations]
        students_not = [not registration.user_ref for registration in registrations]
        
        print(students_not)
        serializer = UserProfileSerializer(students_registered, many=True)
        return Response(serializer.data)