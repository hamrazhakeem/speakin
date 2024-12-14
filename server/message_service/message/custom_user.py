# Since message service doesn't have User Model but consumers expects user instance we are creating a class that mimics User Model
class CustomUser:
    def __init__(self, user_data):
        self.id = user_data.get('id')