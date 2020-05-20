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

    def test_delete_method(self):
        self.biron.delete_editor()
        editors = Editors.objects.filter(id = 1)
        