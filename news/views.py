import datetime as dt
from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404

# Create your views here.
def welcome(request):
    return render(request,'welcome.html')


def news_of_day(request):
    date = dt.date.today()
    return render(request, 'all-news/today-news.html', {"date":date, })

def convert_dates():
    # Function that get the weekday number for the date.
    day_number = dt.date.weekday(dates)

    days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',"Sunday"]

    # Returning the actual day of the week
    day = days[day_number]
    return day

# View Function to present news from the past days
def past_days_news(request,past_date):

    try:
        # Convert data from the string Url
        date = dt.datetime.strptime(past_date,'%Y-%m-%d').date()

    except ValueError:
        # Raise 404 error when ValueError is thrown
        raise Http404()
        assert False
    
    if date == dt.date.today():
        return redirect(news_of_day)

    return render(request, 'all-news/past-news.html', {"date": date})