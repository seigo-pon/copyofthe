import time
import pyperclip
from threading import Thread

class ClipboardReceiver(Thread):

  def __init__(self, callback, app, sleep_time=5.0):
    super(ClipboardReceiver, self).__init__()
    self.callback = callback
    self.app = app._get_current_object()
    self.sleep_time = sleep_time
    self.started = False

  def run(self):
    self.started = True

    is_first = True
    last_value = ''
    while self.started:
      tmp_value = pyperclip.paste()
      if tmp_value != last_value:
        last_value = tmp_value
        self.callback(self.app, is_first, last_value)
        is_first = False

      time.sleep(self.sleep_time)

  def stop(self):
    self.started = False

if __name__ == "__main__":

  def print_value(app, is_first, text):
    if is_first:
      print('First clipboard value: {}'.format(text))
    else:
      print('Copied to clipboard: {}'.format(text))

  receiver = ClipboardReceiver(callback=print_value, sleep_time=0.5)
  receiver.start()

  while True:
    try:
      print('oh....')
      time.sleep(10)
    except KeyboardInterrupt:
      receiver.stop()
      break
