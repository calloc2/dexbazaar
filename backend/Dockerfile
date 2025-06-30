FROM python:3.11-slim

WORKDIR /backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY ../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy wait-for-it script
COPY ../wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Running migrations..."\n\
python manage.py migrate\n\
echo "Populating categories..."\n\
python manage.py populate_categories\n\
echo "Starting server..."\n\
python manage.py runserver 0.0.0.0:8000' > /startup.sh

RUN chmod +x /startup.sh

EXPOSE 8000

CMD ["/startup.sh"]
