from flask_marshmallow import Marshmallow
from models import (
  AppConfigurationModel, TagModel,
  ClipboardModel, ClipboardTagModel,
  ClipboardFavoriteModel, ClipboardCopyModel
)

ma = Marshmallow()


class AppConfigurationSchema(ma.SQLAlchemySchema):
  class Meta:
    model = AppConfigurationModel

  clipboard_expiration_day = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)
  updated_at = ma.auto_field(dump_only=True)


class TagSchema(ma.SQLAlchemySchema):
  class Meta:
    model = TagModel

  uid = ma.auto_field()
  value = ma.auto_field()
  created_at = ma.auto_field(dump_only=True)


class ClipboardTagSchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardTagModel
    fields = ('tag_uid', 'created_at')

class ClipboardFavoriteSchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardFavoriteModel
    fields = ('created_at',)

class ClipboardCopySchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardCopyModel
    fields = ('created_at',)


class ClipboardSchema(ma.SQLAlchemySchema):
  class Meta:
    model = ClipboardModel

  uid = ma.auto_field()
  value = ma.auto_field()
  tags = ma.Nested(ClipboardTagSchema, many=True)
  is_favorite = ma.Nested(ClipboardFavoriteSchema)
  copies = ma.Nested(ClipboardCopySchema, many=True)
  created_at = ma.auto_field(dump_only=True)
  updated_at = ma.auto_field(dump_only=True)
