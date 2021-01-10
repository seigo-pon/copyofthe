from flask_marshmallow import Marshmallow
from models import (
  TagModel, ClipboardModel, ClipboardTagModel, ClipboardCopyModel
)

ma = Marshmallow()


class TagSchema(ma.SQLAlchemySchema):
  class Meta:
    model = TagModel

  uid = ma.auto_field()
  value = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)


class ClipboardSchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardModel

  uid = ma.auto_field()
  value = ma.auto_field()
  tags = ma.auto_field()
  copies = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)
  updated_at = ma.auto_field(dump_only=True)


class ClipboardTagSchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardTagModel

  uid = ma.auto_field()
  clipboard_uid = ma.auto_field()
  tag_uid = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)


class ClipboardCopySchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardCopyModel

  uid = ma.auto_field()
  clipboard_uid = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)
