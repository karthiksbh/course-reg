from django.urls import path
from .views import RegisterView,LoginView,UserProfileView,StudentCoursesAPIView,StudentSearchAPIView,CoursesAPIView,RegisterCourseAPIView, StudentRegisteredCourses,UserCoursesInYearSem,CourseSearchView

urlpatterns = [
    path("register/",RegisterView.as_view(),name='register'),
    path("login/",LoginView.as_view(),name='login'),
    path("profile/",UserProfileView.as_view(),name='profile'),
    path("courses/",CoursesAPIView.as_view(),name='courses'),
    path("student-search/",StudentCoursesAPIView.as_view(),name='student-search'),
    path("student-course/",StudentSearchAPIView.as_view(),name='student-course'),
    path("register-course/",RegisterCourseAPIView.as_view(),name='register_course'),
    
    path("all-courses/",StudentRegisteredCourses.as_view(),name='all_courses'),
    path("year-sem-course/",UserCoursesInYearSem.as_view(),name='year-sem-course'),
    
    path("course-search/",CourseSearchView.as_view(),name='course-search'),
    
]