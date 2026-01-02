from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def home(request):
    return HttpResponse("Welcome to the Dashboard Home Page")

def browse(request):
    return HttpResponse("Browse the Dashboard Content")

def about(request):
    return HttpResponse("About the Dashboard Application")

def faq(request):
    return HttpResponse("Frequently Asked Questions about the Dashboard")

def contact(request):
    return HttpResponse("Contact Us at the Dashboard")

def upload(request):
    return HttpResponse("Upload your files to the Dashboard")

def profile(request):
    return HttpResponse("User Profile Page")

def login(request):
    return HttpResponse("Login to the Dashboard")   

def register(request):
    return HttpResponse("Register for the Dashboard")


