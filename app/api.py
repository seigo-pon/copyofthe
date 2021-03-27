import pyperclip
import time
from clipboard.clipboard_receiver import ClipboardReceiver
from flask import Blueprint, current_app, jsonify, make_response
from flask_restful import Api, Resource, reqparse, inputs
from models import (
  TagModel, ClipboardModel, ClipboardTagModel, ClipboardFavoriteModel, ClipboardCopyModel,
)
from schemas import (
  TagSchema, ClipboardSchema, ClipboardCopySchema
)

api_bp = Blueprint('api',
                   __name__,
                   url_prefix='/api')


class ApiRequestParser:
  def __init__(self):
    self.parser = reqparse.RequestParser()

  def parse_args(self):
    self.args = self.parser.parse_args()
    print('args:', vars(self.args))

  def get(self, key):
    return self.args.get(key)


clipboard_receiver = None
def catch_value(app, is_first, value):
  if is_first:
    print('First clipboard value: {}'.format(value))

    with app.app_context():
      clipboard_value = ClipboardModel.get_by_latest()
      if clipboard_value is not None:
        if clipboard_value.value != value:
          ClipboardModel.insert(value)
  else:
    print('Copied to clipboard: {}'.format(value))

    with app.app_context():
      ClipboardModel.insert(value)


class Tag(Resource):
  def get(self):
    class TagRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('key', type=str, location='args')

    parser = TagRequestParser()
    parser.parse_args()

    tags = TagModel.get_by_key(parser.get('key'))
    if tags is None:
      return make_response('', 400)
    print('tag get:', [vars(tag) for tag in tags])

    tag_schema = TagSchema(many=True)
    return make_response(jsonify({'tags': tag_schema.dump(tags)}))

  def post(self):
    class TagRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('tag', type=str, location='form')

    parser = TagRequestParser()
    parser.parse_args()

    if parser.get('tag') is None:
      return make_response('', 400)

    tags = TagModel.get_by_value(parser.get('tag'))
    if tags and len(tags) > 0:
      return make_response('', 409)
    print('tag post:', [vars(tag) for tag in tags])

    TagModel.insert(parser.get('tag'))
    return make_response('', 201)

  def delete(self):
    class TagRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('tag_uid', type=str, location='args')

    parser = TagRequestParser()
    parser.parse_args()

    if parser.get('tag_uid') is None:
      return make_response('', 400)

    tag = TagModel.get_by_uid(parser.get('tag_uid'))
    if tag is None:
      return make_response('', 404)

    clipboard_values = ClipboardModel.get_by_query(
      key=None,
      tag_uid_list=parser.get('tags'),
      page=None,
      limit=1
    )
    if clipboard_values is not None:
      return make_response('', 409)
    print('tag delete:', vars(tag))

    TagModel.delete(parser.get('tag_uid'))
    return make_response('', 201)


class Clipboard(Resource):
  def get(self):
    class ClipboardRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('key', type=str, location='args')
        self.parser.add_argument('tags', type=str, action='append', location='args')
        self.parser.add_argument('page', type=int, location='args')
        self.parser.add_argument('limit', type=int, location='args')

    parser = ClipboardRequestParser()
    parser.parse_args()

    clipboard_values = ClipboardModel.get_by_query(
      key=parser.get('key'),
      tag_uid_list=parser.get('tags'),
      page=parser.get('pages'),
      limit=parser.get('limit')
    )
    if clipboard_values is None or clipboard_values[0] is None:
      return make_response('', 400)
    print('clipboard get:', [vars(clipboard_value) for clipboard_value in clipboard_values[0]], clipboard_values[1])

    clipboard_schema = ClipboardSchema(many=True)
    return make_response(jsonify({
      'clipboard_values': clipboard_schema.dump(clipboard_values[0]),
      'clipboard_total': clipboard_values[1]
    }))

  def post(self):
    class ClipboardTagRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('clipboard_uid', type=str, location='form')
        self.parser.add_argument('tags', type=str, action='split', location='form')
        self.parser.add_argument('is_favorite', type=int, action='split', location='form')

    parser = ClipboardTagRequestParser()
    parser.parse_args()

    if parser.get('clipboard_uid') is None:
      return make_response('', 400)

    clipboard_value = ClipboardModel.get_by_uid(parser.get('clipboard_uid'))
    if clipboard_value is None:
      return make_response('', 404)
    print('clipboard post:', clipboard_value)

    if parser.get('tags') is not None:
      now_tags = ClipboardTagModel.get_by_clipboard_uid(parser.get('clipboard_uid'))
      now_tag_uid_list = [now_tag.uid for now_tag in now_tags]
      print('clipboard post:', now_tag_uid_list)

      tags = []
      if isinstance(parser.get('tags'), list) is False:
        tags = [parser.get('tags')]
      else:
        tags = parser.get('tags')
      tags = list(filter(lambda x: x != '', tags))
      
      for tag_uid in tags:
        if not (tag_uid in now_tag_uid_list):
          ClipboardTagModel.insert(clipboard_uid=parser.get('clipboard_uid'), tag_uid=tag_uid)
          print('clipboard post:', tag_uid)

      for now_tag_uid in now_tag_uid_list:
        if not (now_tag_uid in tags):
          ClipboardTagModel.delete(now_tag_uid)
          print('clipboard post:', now_tag_uid)

    if parser.get('is_favorite') is not None:
      favorite = ClipboardFavoriteModel.get_by_clipboard_uid(parser.get('clipboard_uid'))
      print('clipboard post:', favorite)

      is_favorite = parser.get('is_favorite')
      if is_favorite == 1:
        if favorite is None:
          ClipboardFavoriteModel.insert(parser.get('clipboard_uid'))
          print('clipboard post:', is_favorite)
      else:
        if favorite is not None:
          ClipboardFavoriteModel.delete(favorite.uid)
          print('clipboard post:', is_favorite)

    return make_response('', 200)

  def delete(self):
    class ClipboardRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('clipboard_uid', type=str, location='args')

    parser = ClipboardRequestParser()
    parser.parse_args()

    if parser.get('clipboard_uid') is None:
      return make_response('', 400)

    clipboard_value = ClipboardModel.get_by_uid(parser.get('clipboard_uid'))
    if clipboard_value is None:
      return make_response('', 404)
    print('clipboard delete:', vars(clipboard_value))

    ClipboardModel.delete(parser.get('clipboard_uid'))
    return make_response('', 200)


class ClipboardCopy(Resource):
  def post(self):
    class ClipboardRequestParser(ApiRequestParser):
      def __init__(self):
        super().__init__()
        self.parser.add_argument('clipboard_uid', type=str, location='form')

    parser = ClipboardRequestParser()
    parser.parse_args()

    if parser.get('clipboard_uid') is None:
      return make_response('', 400)

    clipboard_value = ClipboardModel.get_by_uid(parser.get('clipboard_uid'))
    if clipboard_value is None:
      return make_response('', 404)
    print('clipboard_copy post:', vars(clipboard_value))

    if clipboard_receiver:
      clipboard_receiver.stop()
    pyperclip.copy(clipboard_value.value)
    if clipboard_receiver:
      clipboard_receiver.start()

    ClipboardCopyModel.insert(parser.get('clipboard_uid'))
    return make_response('', 201)


class ClipboardReceive(Resource):
  def post(self):
    clipboard_receiver = ClipboardReceiver(callback=catch_value, app=current_app, sleep_time=0.5)
    clipboard_receiver.start()
    return make_response('', 200)

  def delete(self):
    if clipboard_receiver:
      clipboard_receiver.stop()
    return make_response('', 200)


api = Api(api_bp)
api.add_resource(Tag, '/tag')
api.add_resource(Clipboard, '/clipboard')
api.add_resource(ClipboardCopy, '/clipboard/copy')
api.add_resource(ClipboardReceive, '/clipboard/receive')
