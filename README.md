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

