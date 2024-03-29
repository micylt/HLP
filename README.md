# Harm Lessening and Prevention (HLP)

With our system, we plan to solve the problem of addicts not knowing when and where to go for needle disposal and replacement. As a result of this, we hope to see a decline in the spreading of blood transmitted diseases such has hepatitis and HIV. This is something addicts should care about because not only is this helping themselves in the fact that they will be at lower risk of contracting a blood transmitted disease, but also other users around them and the environment.

Our solution to this problem is to create a user-friendly web-application to help users find nearby clinics or disposal services. This app will also contain links to available resources and hotlines for the user to reach out to in addition to our product.
We estimate that some narcotics addicts do not own smart phones; however, public libraries provide free internet access. This is why we have decided to make our product solely a web-application. We do plan on making this app mobile browser friendly, in the case that the user prefers to use a phone or tablet. This will be achieved by the use of dynamic HTML which will allow for the front-end of our website to scale to the size of the user’s screen.

# Setup and Installation

HLP runs on Python 3.6 and utilizes the Flask framework.

All html files must go in the `templates` directory.

All JavaScript and CSS files must go in the `static` directory.

OpenSSL version 1.X or greater required.

Google API Key: AIzaSyDj0h-T1onIDApJ9DHhP8-jfs0I26JcvLs

### Python Dependencies

To install python library dependencies, run the following:

	pip3 install -r requirements.txt

To run the webserver, open up the terminal and start the server with either

        ./server.py or python3 server.py

Then go to any browser (chrome or firefox recommended) and type

     	localhost:5000/