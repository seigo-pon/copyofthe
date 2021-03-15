# Copy of the
- Electronアプリ

## 開発環境
- バックエンド
  - Python 3.7
  - Flask
  - SQLAlchemy
  - Pyperclip
- フロントエンド
  - Vue
  - TailwindCSS
- アプリ
  - Electron

## API

### クリップボード監視
- http://localhost:5000/api/clipboard/receive

#### POST
- 監視開始

##### リクエスト
- なし

##### レスポンス
- 成功
  - ステータスコード
    - 200

#### DELETE
- 監視終了

##### リクエスト
- なし

##### レスポンス
- 成功
  - ステータスコード
    - 200

### クリップボード情報操作
- http://localhost:5000/api/clipboard

#### GET
- クリップボードデータリスト取得

##### リクエスト
- Query

|name|type|detail|
|--|--|--|
|key|string|検索キーワード|
|tags|list|タグIDリスト|
|page|integer|ページ位置|
|limit|integer|１ページ最大数|

##### レスポンス
- 成功
  - ステータスコード
    - 200
  - Body
    - JSON

#### POST
- クリップボードデータにタグを紐付け

##### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|
|tags|list|タグIDリスト|

##### レスポンス
- 成功
  - ステータスコード
    - 200

#### DELETE
- クリップボードデータ削除

##### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|

##### レスポンス
- 成功
  - ステータスコード
    - 200

### タグ
- http://localhost:5000/api/tag

#### GET
- タグデータリスト取得

##### リクエスト
- Query

|name|type|detail|
|--|--|--|
|key|string|検索キーワード|

##### レスポンス
- 成功
  - ステータスコード
    - 200
  - Body
    - JSON

#### POST
- タグデータ作成

##### リクエスト
- Query

|name|type|detail|
|--|--|--|
|tag|string|タグ文字列|

##### レスポンス
- 成功
  - ステータスコード
    - 200

### クリップボードコピー
- http://localhost:5000/api/clipboard/copy

#### POST
- クリップボードコピー

##### リクエスト
- Form

|name|type|detail|
|--|--|--|
|clipboard_uid|string|クリップボードID|

##### レスポンス
- 成功
  - ステータスコード
    - 200

## 使い方

### 開発環境起動

```
$ npm i
$ cd front
$ npm i
$ npm run build
$ cd ../app
$ pip install -r requirements.txt
$ cd ../
$ npm run dev
```

#### バックエンドのみ

```
$ cd app
$ pip install -r requirements.txt
$ python app.py
```

#### フロントエンドのみ

```
$ cd front
$ npm i
$ npm run dev
```

### 本番ビルド

```
$ npm i
$ cd front
$ npm i
$ npm run build
$ cd ../app
$ pip install -r requirements.txt
$ cd ../
$ npm run build
```

