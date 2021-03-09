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
- URL
  - http://localhost:5000/api/clipboard/receive
- POST
  - 開始
- DELETE
  - 終了

### クリップボード情報操作
- URL
  - http://localhost:5000/api/clipboard
- GET
  - リスト取得
  - リクエスト
    - key
    - tags
    - page
    - limit
- POST
  - タグ付
  - リクエスト
    - clipboard_uid
    - tags
- DELETE
  - 削除
  - リクエスト
    - clipboard_uid

#### タグ
- URL
  - http://localhost:5000/api/tag
- GET
  - リスト取得
  - リクエスト
    - key
- POST
  - 作成
  - リクエスト
    - tag

#### クリップボードコピー
- URL
  - http://localhost:5000/api/clipboard/copy
- POST
  - クリップボードコピー
  - リクエスト
    - clipboard_uid

## 使い方

### 開発起動

```
$ npm i
$ cd front
$ npm i
$ npm run build
$ cd ../
$ npm run dev
```
### 本番ビルド

```
$ npm i
$ cd front
$ npm i
$ npm run build
$ cd ../
$ npm run build
```

