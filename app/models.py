import uuid
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


db = SQLAlchemy()


def get_start_of_day(date):
  return date.replace(hour=0, minute=0, second=0, microsecond=0)

def get_end_of_day(date):
  start = get_start_of_day(date)
  return start + timedelta(hours=24)

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
  def get_by_uid(uid):
    return TagModel.query.filter_by(uid=uid).order_by(TagModel.order()).first()

  @staticmethod
  def get_by_uids(uids):
    return TagModel.query.filter(TagModel.uid.in_(uids)).order_by(TagModel.order()).all()

  @staticmethod
  def insert(value):
    model = TagModel(uid=uuid.uuid4().hex, value=value)
    db.session.add(model)
    db.session.commit()

  @staticmethod
  def delete(uid):
    model = TagModel.query.filter_by(uid=uid).first()
    if model:
      db.session.delete(model)
      db.session.commit()


class ClipboardModel(db.Model):
  __tablename__ = 'clipboard_table'

  uid = db.Column(db.String(100), primary_key=True)
  value = db.Column(db.Text, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

  @staticmethod
  def order():
    return db.desc(ClipboardModel.updated_at)

  @staticmethod
  def get_by_query(key, date, tag_uids, page, limit):
    if page is None:
      page = 1
    if limit is None:
      limit = 100
    all_page = (limit if limit > 1 else 1) * (page if page > 0 else 1)

    filtered_date = None
    if date:
      filtered_date = datetime.fromtimestamp(date)

    clipboard_tags = []
    if tag_uids:
      clipboard_tags = ClipboardTagModel.get_by_tag(tag_uids)

    uids = []
    if clipboard_tags and len(clipboard_tags) > 0:
      uids = [clipboard_tag.clipboard_uid for clipboard_tag in clipboard_tags]

    ret = ClipboardModel.query.filter(
      ClipboardModel.uid.in_(uids) if len(uids) > 0 else True
    ).filter(
      ClipboardModel.value.like(f'%{key}%') if key else True
    ).filter(
      ClipboardModel.updated_at >= get_start_of_day(filtered_date) if filtered_date else True
    ).filter(
      ClipboardModel.updated_at <= get_end_of_day(filtered_date) if filtered_date else True
    ).order_by(ClipboardModel.order()).limit(all_page).all()

    if ret is None:
      return ([], 0)

    page_len = len(ret) / limit
    if page_len < page:
      return (ret, len(ret))

    return (ret[(limit * (page - 1)):((limit * page) - 1)], len(ret))

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
  clipboard = db.relationship("ClipboardModel", backref="tags")
  tag_uid = db.Column(db.Integer, db.ForeignKey('tag_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def get_by_tag(tag_uids):
    tags = TagModel.get_by_uids(tag_uids)
    if tags and len(tags) > 0:
      return ClipboardTagModel.query.filter(ClipboardTagModel.tag_uid.in_(tag_uids)).order_by(ClipboardTagModel.clipboard_uid).all()
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


class ClipboardFavoriteModel(db.Model):
  __tablename__ = 'clipboard_favorite_table'

  uid = db.Column(db.String(100), primary_key=True)
  clipboard_uid = db.Column(db.Integer, db.ForeignKey('clipboard_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  clipboard = db.relationship("ClipboardModel", backref=db.backref("is_favorite", uselist=False))
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def get_by_clipboard_uid(clipboard_uid):
    return ClipboardFavoriteModel.query.filter_by(clipboard_uid=clipboard_uid).first()

  @staticmethod
  def insert(clipboard_uid):
    model = ClipboardFavoriteModel(uid=uuid.uuid4().hex, clipboard_uid=clipboard_uid)
    db.session.add(model)
    db.session.commit()

  @staticmethod
  def delete(uid):
    model = ClipboardFavoriteModel.query.filter_by(uid=uid).first()
    if model:
      db.session.delete(model)
      db.session.commit()


class ClipboardCopyModel(db.Model):
  __tablename__ = 'clipboard_copy_table'

  uid = db.Column(db.String(100), primary_key=True)
  clipboard_uid = db.Column(db.Integer, db.ForeignKey('clipboard_table.uid', onupdate='CASCADE', ondelete='CASCADE'))
  clipboard = db.relationship("ClipboardModel", backref="copies")
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  @staticmethod
  def insert(clipboard_uid):
    model = ClipboardCopyModel(uid=uuid.uuid4().hex, clipboard_uid=clipboard_uid)
    db.session.add(model)
    db.session.commit()


def init_db(app):
    db.init_app(app)
    db.create_all()
