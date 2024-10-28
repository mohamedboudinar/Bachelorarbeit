from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,"index.html")

def contact(request):
    return render(request,"contact_us.html")


def about(request):
    return render(request,"about_us.html")


def contactform(request):
    return render(request,"contact-form.html")

def sendform(request):
    return render(request,"contact-form.html")