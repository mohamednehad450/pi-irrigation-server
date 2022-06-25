# pi-irrigation-server

## Contents

- [About The Project ](#about-the-project)
- [Getting Started](#getting-started)

## About The Project
A web application meant to be ran on a Raspberry Pi to provide control over the GPIO pins in an irrgation system.


## Getting Started
### Installing dependencies
#### Backend (Django)

1. Install Django:

    ```pip3 install django```

2. Install Django REST framework:

    ``` pip3 install djangorestframework ```

3. Install Django REST framework JWT Auth:

    ```pip3 install djangorestframework-jwt```

#### Frontend (React)

1. Install Node.js LTS [here](https://nodejs.org/) or using nvm [here](https://github.com/nvm-sh/nvm)

2. Install yarn package manager

    ```npm install -g yarn```


### Setup
1. Clone this repo
	```git clone https://github.com/mohamednehad450/pi-irrigation-server.git```

2. Run database migration

   ``` python3 manage.py migrate```

3. Install frontend dependencies

	```cd frontend && yarn install```

4. Build the frontend production

	```yarn build```


### Configration 

1.	set `DEBUG = False`  and `ALLOWED_HOSTS = ['YOUR_PI_IP']`  in   ```pi_irrigation/settings.py``` 

2. create superuser `python3 manage.py createsuperuser` to be used for authentication later

3. start app at boot
	-  run `sudo crontab -e`
	- and add `@reboot python3 /path/to/repe/manage.py runserver` 


