import datetime as dt
from django.test import TestCase
from .models import Editor,Article,tags


class EditorTestClass(TestCase):

    # Set up method
    def setUp(self):
        self.biron=Editor(first_name = 'Biron', last_name = 'Otineo', email = 'bironodhiambo00@gmail.com')
    # Testing instance
    def test_instance(self):
        self.assertTrue(isinstance(self.biron,Editor))

    # Testing Save Method
    def test_save_method(self):
        self.biron.save_editor()
        editors = Editor.objects.all()
        self.assertTrue(len(editors) > 0)

    # def test_delete_method(self):
    #     self.biron.delete_editor()
    #     editors = Editors.objects.filter(id = 1)
        

class ArticleTestClass(TestCase):

    def setUp(self):
        # Creating a new editor and saving it
        self.biron = Editor(first_name = 'Biron', last_name = 'Otieno', email = 'bironodhiambo0@gmail.com')
        self.biron.save_editor()

        # Creating a new tag and saving it
        self.new_tag = tags(name = 'testing')
        self.new_tag.save()

        self.new_article= Article(title = 'Test Article', post = 'This is a random test Post', editor = self.biron)
        self.new_article.save()

        self.new_article.tags.add(self.new_tag)

    def tearDown(self):
        Editor.objects.all().delete()
        tags.objects.all().delete()
        Article.objects.all().delete()

    def test_get_news_today(self):
        todays_news = Article.todays_news()
        self.assertTrue(len(todays_news) > 0)

    def get_news_by_date(self):
        test_date = '2020-05-20'
        date = dt.datetime.strptime(test_date, '%Y-%m-%d').date()
        get_news_by_date = Article.days_news(date)
        self.assertTrue(len(news_by_date) == 0)