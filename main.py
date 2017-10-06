from flask import Flask, render_template, request, session, redirect, url_for


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
        # DB background here #
        session['username'] = username
        return redirect(url_for('route_index'))

    return render_template('form.html')


@app.route("/login", methods=['GET', 'POST'])
def route_login():
    if session['username']:
        return redirect(url_for('route_index'))
    return render_template('form.html')


@app.route("/logout")
def route_logout():
    session.pop('username', None)
    return redirect(url_for('route_index'))

if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True, host='''0.0.0.0''')
