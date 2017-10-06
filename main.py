from flask import Flask, render_template, request, session, redirect, url_for
import queries
import werkzeug


app = Flask(__name__)


@app.route("/")
def route_index():
    return render_template("index.html")


@app.route("/registration", methods=['GET', 'POST'])
def route_registration():
    if session:
        return redirect(url_for('route_index'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if queries.registrate_user(username, password):
            session['username'] = username
        else:
            return redirect("/registration?taken_username=1")
        return redirect(url_for('route_index'))

    return render_template('form.html')


@app.route("/login", methods=['GET', 'POST'])
def route_login():
    if session:
        return redirect(url_for('route_index'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if queries.login_user(username, password):
            session['username'] = username
        else:
            return redirect("/login?invalid_credentials=1")
        return redirect(url_for('route_index'))
    return render_template('form.html')


@app.route("/logout")
def route_logout():
    session.pop('username', None)
    return redirect(url_for('route_index'))

app.secret_key = 'APIWARS-v1'


if __name__ == "__main__":
    app.run(debug=True, host='''0.0.0.0''')
