import psycopg2
import psycopg2.extras
import werkzeug
import os
import urllib


def open_database():
    try:
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ.get("DATABASE_URL"))
        connection = psycopg2.connect(
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print(exception)
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        # we set the cursor_factory parameter to return with a dict cursor (cursor which provide dictionaries)
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value
    return wrapper


@connection_handler
def registrate_user(cursor, username, password):
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    hashed_password = werkzeug.security.generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
    if not cursor.fetchall():
        cursor.execute("""INSERT INTO users (username, password)
                          VALUES (%s, %s)""", (username, hashed_password))
        return True
    return False


@connection_handler
def login_user(cursor, username, password):
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    userdata = cursor.fetchone()
    if werkzeug.security.check_password_hash(userdata['password'], password):
        return True
    return False
