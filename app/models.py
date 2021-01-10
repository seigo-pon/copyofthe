import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


db = SQLAlchemy()


class TagModel(db.Model):
  __tablename__ = 'tag_table'

  uid = db.Column(db.String(100), primary_key=True)
  value = db.Column(db.String(100), nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def order():
    return db.asc(TagModel.value)

  @staticmethod
  def get_by_key(key):
    if key:
      return TagModel.query.filter(TagModel.value.like(f'%{key}%')).order_by(TagModel.order()).all()
    else:
      return TagModel.query.order_by(TagModel.value).all()

  @staticmethod
  def get_by_value(value):
    return TagModel.query.filter_by(value=value).order_by(TagModel.order()).all()

  @staticmethod
  def get_by_uid_list(uid_list):
    return TagModel.query.filter(TagModel.uid.in_(uid_list)).order_by(TagModel.order()).all()

  @staticmethod
  def insert(value):
    model = TagModel(uid=uuid.uuid4().hex, value=value)
    db.session.add(model)
    db.session.commit()


class ClipboardModel(db.Model):
  __tablename__ = 'clipboard_table'

  uid = db.Column(db.String(100), primary_key=True)
  value = db.Column(db.Text, nullable=False)
  tags = db.relationship("ClipboardTagModel", backref="clipboard_table")
  copies = db.relationship("ClipboardCopyModel", backref="clipboard_table")
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

  @staticmethod
  def order():
    return db.desc(ClipboardModel.created_at)

  @staticmethod
  def get_by_query(key, tag_uid_list, page, limit):
    if page is None:
      page = 1
    if limit is None:
      limit = 100
    all_page = (limit if limit > 1 else 1) * (page if page > 0 else 1)

    clipboard_tag_list = []
    if tag_uid_list:
      clipboard_tag_list = ClipboardTagModel.get_by_tag(tag_uid_list)

    uid_list = []
    if clipboard_tag_list and len(clipboard_tag_list) > 0:
      uid_list = [clipboard_tag.clipboard_uid for clipboard_tag in clipboard_tag_list]

    ret = None
    if len(uid_list) > 0:
      if key:
        ret = ClipboardModel.query.filter(
          ClipboardModel.uid.in_(uid_list),
          ClipboardModel.value.like(f'%{key}%'),
        ).order_by(ClipboardModel.order()).limit(all_page).all()
      else:
        ret = ClipboardModel.query.filter(
          ClipboardModel.uid.in_(uid_list),
        ).order_by(ClipboardModel.order()).limit(all_page).all()
    else:
      if key:
        ret = ClipboardModel.query.filter(
          ClipboardModel.value.like(f'%{key}%'),
        ).order_by(ClipboardModel.order()).limit(all_page).all()
      else:
        ret = ClipboardModel.query.order_by(ClipboardModel.order()).limit(all_page).all()

    if ret is None:
      return []

    page_len = len(ret) / limit
    if page_len < page:
      return ret

    return ret[(limit * (page - 1)):((limit * page) - 1)]

  @staticmethod
  def get_by_uid(uid):
    return ClipboardModel.query.filter_by(uid=uid).order_by(ClipboardModel.order()).first()

  @staticmethod
  def get_by_latest():
    return ClipboardModel.query.order_by(ClipboardModel.order()).first()

  @staticmethod
  def insert(value):
    model = ClipboardModel(uid=uuid.uuid4().hex, value=value)
    db.session.add(model)
    db.session.commit()

  @staticmethod
  def delete(uid):
    model = ClipboardModel.query.filter_by(uid=uid).first()
    if model:
      db.session.delete(model)
      db.session.commit()


class ClipboardTagModel(db.Model):
  __tablename__ = 'clipboard_tag_table'

  uid = db.Column(db.String(100), primary_key=True)
  clipboard_uid = db.Column(db.Integer, db.ForeignKey('clipboard_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  tag_uid = db.Column(db.Integer, db.ForeignKey('tag_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def get_by_tag(tag_uid_list):
    tags = TagModel.get_by_uid_list(tag_uid_list)
    if tags and len(tags) > 0:
      tag_uid_list = [tag.uid for tag in tags]
      return ClipboardTagModel.query.filter(ClipboardTagModel.tag_uid.in_(tag_uid_list)).order_by(ClipboardTagModel.clipboard_uid).all()
    else:
      return None

  @staticmethod
  def get_by_clipboard_uid(clipboard_uid):
    return ClipboardTagModel.query.filter_by(clipboard_uid=clipboard_uid).order_by(ClipboardTagModel.created_at).all()

  @staticmethod
  def insert(clipboard_uid, tag_uid):
    model = ClipboardTagModel(uid=uuid.uuid4().hex, clipboard_uid=clipboard_uid, tag_uid=tag_uid)
    db.session.add(model)
    db.session.commit()

  @staticmethod
  def delete(uid):
    model = ClipboardTagModel.query.filter_by(uid=uid).first()
    if model:
      db.session.delete(model)
      db.session.commit()


class ClipboardCopyModel(db.Model):
  __tablename__ = 'clipboard_copy_table'

  uid = db.Column(db.String(100), primary_key=True)
  clipboard_uid = db.Column(db.Integer, db.ForeignKey('clipboard_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def insert(clipboard_uid):
    model = ClipboardCopyModel(uid=uuid.uuid4().hex, clipboard_uid=clipboard_uid)
    db.session.add(model)
    db.session.commit()


def init_db(app):
    db.init_app(app)
    db.create_all()
