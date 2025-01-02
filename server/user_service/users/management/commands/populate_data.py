from django.core.management.base import BaseCommand
from users.utils import populate_languages, populate_proficiencies

class Command(BaseCommand):
    help = 'Populates the database with initial languages and proficiencies'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating languages...')
        populate_languages()
        self.stdout.write(self.style.SUCCESS('Successfully populated languages'))

        self.stdout.write('Populating proficiencies...')
        populate_proficiencies()
        self.stdout.write(self.style.SUCCESS('Successfully populated proficiencies'))
