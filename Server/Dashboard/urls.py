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
    path('accounts/login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('accounts/logout/', views.logout, name='logout'),
    path('book/<int:id>/', views.book_detail, name='book_detail'),
    path('tos_privacy/', views.tos_privacy, name='tos_privacy'),
    path('logout/', views.logout, name='logout'),
]
