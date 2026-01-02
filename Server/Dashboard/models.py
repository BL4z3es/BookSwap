from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_name = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)
    

    def __str__(self):
        return self.user.username
    
class Book(models.Model):
    title = models.CharField(max_length=200)
    grade = models.IntegerField(blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True)
    condition = models.IntegerField(blank=True, null=True)
    notes= models.TextField(blank=True, max_length=1000)
    #image = models.ImageField(upload_to='book_images/', blank=True)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='books')
    
    contact_methods = [
        ('E', 'Email'),
        ('W', 'Whatsapp'),
        ('P', 'Phone'),
    ]
    contact_method = models.CharField(max_length=1, choices=contact_methods, blank=True)
    contact_info = models.CharField(max_length=200, blank=True)
    is_available = models.BooleanField(default=True)
    reserved_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='reserved_books')
    
    publish_date = models.DateTimeField(auto_now_add=True)