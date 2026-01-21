from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.models import User
from .models import UserProfile, Book
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
# Create your views here.
def home(request):
    return render(request, 'Dashboard/home.html')

def browse(request):
    return render(request, 'Dashboard/browse.html')

def about(request):
    return render(request, 'Dashboard/about.html')

def faq(request):
    return render(request, 'Dashboard/faq.html')

def contact(request):
    return render(request, 'Dashboard/contact.html')                

def upload(request):
    return HttpResponse("Upload your files to the Dashboard") # Not Completed Yet

@login_required
def profile(request):
    userProfile = UserProfile.objects.get(user=request.user)
    userbooks = Book.objects.filter(owner=userProfile)
    context= {'userProfile': userProfile, "books":userbooks}
    return render(request, 'Dashboard/profile.html', context=context) 
def login(request):
    return render(request, 'Dashboard/login.html')  # Not Completed Yet
@csrf_exempt
def register(request):
    if request.method == 'POST':
        # Handle form submission (Not Completed Yet)
        
        #Ready registration data
        email = request.POST.get('email')
        password = request.POST.get('password')
        grade = request.POST.get('grade')
        grad_year = request.POST.get('gradyear')
        name = request.POST.get('first_name')
        surname = request.POST.get('last_name')
        


        #Add error states
        if User.objects.filter(username=email).exists():
            messages.error(request, 'Email is already registered.')
            return  render(request, 'Dashboard/signup.html')  # Placeholder response
        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return render(request, 'Dashboard/signup.html')  # Placeholder response
        



        user_instance = User.objects.create_user(username=email, email=email, password=password)
        user_profile = UserProfile.objects.create(
            user=user_instance,
            grade=grade,
            gradyear=grad_year,
            name=name,
            surname=surname
        )

        user_profile.save()
        login_user = authenticate(username=email, password=password)
        auth_login(request, login_user)
        messages.success(request, 'Registration successful. You can now log in.')
        return redirect('profile')  # Placeholder response

        

    else:
        return render(request, 'Dashboard/signup.html')  # Not Completed Yet


@login_required
def book_detail(request, id):
    return HttpResponse(f"Details of the book with ID: {id}")# Not Completed Yet


def tos_privacy(request):
    return HttpResponse(
        """<h1>Terms of Service and Privacy Policy</h1><br><br>
        Only Robert College Students/parents are allowed to use this site.<br>
        By using this site, you agree to our Terms of Service and Privacy Policy, which is non existent.<br>
        If you do not agree to these terms, please do not use our site.<br>
        Or just ask me on: <br><br><br><br><br><br><br>
        <a href="https://www.youtube.com/watch?v=oHg5SJYRHA0"
   style="
     font-family: 'Segoe UI', sans-serif;
     font-size: 1.2rem;
     color: #7f5af0;
     text-decoration: none;
     padding: 0.45em 0.75em;
     border-radius: 8px;
     background: linear-gradient(120deg, rgba(127,90,240,0.18), rgba(255,255,255,0));
     transition: all 0.25s ease;
     display: inline-block;
   "
   onmouseover="
     this.style.color='#ffffff';
     this.style.background='linear-gradient(120deg, #7f5af0, #5a3df0)';
     this.style.boxShadow='0 8px 20px rgba(127,90,240,0.35)';
     this.style.transform='translateY(-2px)';
   "
   onmouseout="
     this.style.color='#7f5af0';
     this.style.background='linear-gradient(120deg, rgba(127,90,240,0.18), rgba(255,255,255,0))';
     this.style.boxShadow='none';
     this.style.transform='translateY(0)';
   "
>
  LinkedIn
</a>"""
    )



@login_required
def logout(request):
    auth_logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('home')