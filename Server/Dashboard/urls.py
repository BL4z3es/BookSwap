from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('browse/', views.browse, name='browse'),
    path('faq/', views.faq, name='faq'),
    path('contact/', views.contact, name='contact'),
    path('upload/', views.upload, name='upload'),
    path('profile/', views.profile, name='profile'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
]
