# API

## クリップボード監視
- http://localhost:5000/api/clipboard/receive

### POST
- 監視開始

#### リクエスト
- なし

#### レスポンス
- 成功
  - ステータスコード
    - 200

### DELETE
- 監視終了

#### リクエスト
- なし

#### レスポンス
- 成功
  - ステータスコード
    - 204

## クリップボード操作
- http://localhost:5000/api/clipboard

### GET
- クリップボードデータリスト取得

#### リクエスト
- Query

|name|type|detail|
|--|--|--|
|key|string|検索キーワード|
|date|integer|フィルタする日付のUNIXTIME|
|tags|list|タグIDリスト|
|page|integer|ページ位置|
|limit|integer|１ページ最大数|

#### レスポンス
- 成功
  - ステータスコード
    - 200
  - Body
    - JSON

```
{
  "clipboard_total": 1,
  "clipboard_values": [
    {
      "copies": [],
      "created_at": "2021-03-17T23:55:25.332038",
      "is_favorite": null,
      "tags": [
        {
          "created_at": "2021-03-17T23:55:48.529708",
          "tag_uid": "201724299976483296c476ef06d65421"
        }
      ],
      "uid": "97b634f0b8a34047a68bafaad4b5c775",
      "updated_at": "2021-03-17T23:55:25.332058",
      "value": "clipboard_total"
    }
  ]
}
```
### POST
- クリップボードデータに付随情報を設定

#### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|
|tags|list|タグIDリスト|
|is_favorite|integer|お気に入り|

#### レスポンス
- 成功
  - ステータスコード
    - 200

### DELETE
- クリップボードデータ削除

#### リクエスト
- Query

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|

#### レスポンス
- 成功
  - ステータスコード
    - 204

## クリップボードコピー
- http://localhost:5000/api/clipboard/copy

### POST
- クリップボードコピー

#### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|

#### レスポンス
- 成功
  - ステータスコード
    - 200

## クリップボード整理
- http://localhost:5000/api/clipboard/cleanup

### DELETE
- クリップボードデータを設定に応じてまとめて削除

#### リクエスト
- なし

#### レスポンス
- 成功
  - ステータスコード
    - 204

## タグ
- http://localhost:5000/api/tag

### GET
- タグデータリスト取得

#### リクエスト
- Query

|name|type|detail|
|--|--|--|
|key|string|検索キーワード|

#### レスポンス
- 成功
  - ステータスコード
    - 200
  - Body
    - JSON

```
{
  "tags": [
    {
      "created_at": "2021-03-17T23:55:19.574835",
      "uid": "201724299976483296c476ef06d65421",
      "value": "new_tag"
    }
  ]
}
```
### POST
- タグデータ作成

#### リクエスト
- Form

|name|type|detail|
|--|--|--|
|tag|string|タグ文字列|

#### レスポンス
- 成功
  - ステータスコード
    - 200
    - 400
    - 409

### DELETE
- タグデータ削除

#### リクエスト
- Query

|name|type|detail|
|--|--|--|
|tag_uid|string|タグボードID|

#### レスポンス
- 成功
  - ステータスコード
    - 204
- 失敗
  - ステータスコード
    - 400
    - 404
    - 409

## アプリ設定
- http://localhost:5000/api/configuration

### GET
- アプリ設定取得

#### リクエスト
- なし

#### レスポンス
- 成功
  - ステータスコード
    - 200
  - Body
    - JSON

```
{
  "configuration": {
    "created_at": "2021-03-17T23:55:19.574835",
    "updated_at": "2021-03-17T23:55:25.332058",
    "clipboard_expiration_day": 90
  }
}
```
### POST
- アプリ設定更新

#### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_expiration_day|integer|クリップボードデータ有効日数|

#### レスポンス
- 成功
  - ステータスコード
    - 200
    - 400
    - 409
