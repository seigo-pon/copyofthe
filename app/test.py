import os
import pytest
import tempfile
import app

@pytest.fixture
def client():
    db_fd, app.app.config['DATABASE'] = tempfile.mkstemp()
    app.app.config['TESTING'] = True

    client = app.app.test_client()
    with app.app.app_context():
        app.init_db()
    yield client

    os.close(db_fd)
    os.unlink(app.app.config['DATABASE'])

def test_empty_db(client):
    rv = client.get('/')
    assert b'No entries here so far' in rv.data

def test_clipboard_receive_start(client):
    rv = client.post('/clipboard/receive')
    assert b'Invalid started receiving clipboard' in rv.data

def test_clipboard_receive_end(client):
    rv = client.delete('/clipboard/receive')
    assert b'Invalid ended receiving clipboard' in rv.data
