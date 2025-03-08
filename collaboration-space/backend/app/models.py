from django.db import models
from azure.identity import DefaultAzureCredential
import pyodbc 

# Use DefaultAzureCredential to authenticate
#credential = DefaultAzureCredential()

# Get the token for Azure SQL Database
#token = credential.get_token("https://database.windows.net/.default").token

# Connection string for Azure SQL Database
# conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};' \
#            'SERVER=educapstone-server.database.windows.net;' \
#            'DATABASE=EduBoardDB;' \
#            'Authentication=ActiveDirectoryMFA;'

# # Establish the connection using the token
# conn = pyodbc.connect(conn_str, attrs_before={1256: token})

# # Query the database 
# cursor = conn.cursor()
# cursor.execute("Select @@Version")
# row = cursor.fetchone()

# print("Connected successfully")
# ##print("SQL Server version: ", row[0])
