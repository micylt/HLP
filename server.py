from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')

@app.route("/")

def main():
    return render_template('view.html')

if __name__ == "__main__":
    # detailed log files on errors
    app.debug = True
    app.run()
