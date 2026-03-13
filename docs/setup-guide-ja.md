# LinkStash セットアップガイド（初めての方へ）

このガイドでは、プログラミング経験がなくても LinkStash を使えるように、手順をひとつずつ説明します。

---

## 必要なもの

- Windows または Mac のPC（スマホでは動きません）
- インターネット接続

---

## ステップ 1: Python をインストールする

LinkStash は Python というプログラミング言語で動いています。まず Python をPCに入れます。

### Windows の場合

1. https://www.python.org/downloads/ にアクセス
2. 黄色い **「Download Python 3.x.x」** ボタンをクリック
3. ダウンロードしたファイルを開く
4. **「Add python.exe to PATH」にチェックを入れる**（これが一番大事！）
5. 「Install Now」をクリック
6. 「Setup was successful」と出たら完了

### Mac の場合

1. https://www.python.org/downloads/ にアクセス
2. **「Download Python 3.x.x」** ボタンをクリック
3. ダウンロードした `.pkg` ファイルを開いてインストール

### 確認方法

インストールできたか確認します。

**Windows**: スタートメニューで「cmd」と検索 →「コマンドプロンプト」を開く
**Mac**: Spotlight（`Cmd+Space`）で「ターミナル」と検索 → 開く

以下を入力して Enter:

```
python --version
```

`Python 3.9.x` のように表示されればOKです。

> **うまくいかない場合**: Windows で `python` が見つからないと言われたら、代わりに `python3 --version` を試してください。それでもダメならPython のインストールからやり直し、「Add to PATH」にチェックを入れ忘れていないか確認してください。

---

## ステップ 2: LinkStash をダウンロードする

1. https://github.com/MiraQue/LinkStash にアクセス
2. 緑色の **「<> Code」** ボタンをクリック
3. **「Download ZIP」** をクリック
4. ダウンロードした `LinkStash-master.zip` を好きな場所に展開（解凍）する
   - Windows: 右クリック →「すべて展開」
   - Mac: ダブルクリックで自動展開

> `git clone` が使える方はそちらでもOKです。

---

## ステップ 3: 必要なライブラリをインストールする

コマンドプロンプト（Windows）またはターミナル（Mac）を開いて、展開したフォルダに移動します。

### フォルダへの移動方法

**一番簡単な方法（Windows）:**
1. 展開した `LinkStash-master` フォルダを開く
2. フォルダ上部のアドレスバー（パスが表示されている部分）をクリック
3. `cmd` と入力して Enter → そのフォルダでコマンドプロンプトが開く

**一番簡単な方法（Mac）:**
1. 展開した `LinkStash-master` フォルダを Finder で開く
2. メニューバーの「Finder」→「サービス」→「フォルダでターミナルを開く」

**手動で移動する場合:**

```
cd ダウンロード先のパス/LinkStash-master
```

例:
```
cd C:\Users\あなたの名前\Downloads\LinkStash-master
```

### ライブラリのインストール

フォルダに移動できたら、以下を入力して Enter:

```
pip install -r requirements.txt
```

テキストがたくさん流れて、最後に `Successfully installed ...` と出ればOKです。

> Windows で `pip` が見つからない場合は `python -m pip install -r requirements.txt` を試してください。

---

## ステップ 4: LinkStash を起動する

同じコマンドプロンプト / ターミナルで:

```
python app.py
```

すると `LinkStash starting... http://localhost:5000` と表示されます。
ブラウザで `http://localhost:5000` にアクセスしてください。

**Windows の場合、もっと簡単な方法があります:**

同梱の `start-linkstash.cmd` をダブルクリックするだけで起動でき、ブラウザも自動で開きます。

---

## ステップ 5: 使ってみる

1. 画面上部の **紫色の枠** に保存したいURLを貼り付けて Enter
2. タイトルや説明が自動で取得されます
3. タグを確認・調整して **「保存」** をクリック
4. カードとして一覧に表示されます！

> **メタデータが取得できなかった場合**: 一部のサイトではタイトルや概要を自動取得できないことがあります。その場合でも登録モーダルは開くので、タイトルやメモを手入力して保存できます。

### よく使う機能

| やりたいこと | 操作 |
|-------------|------|
| リンクを保存 | URL入力欄にURLを貼って Enter → 保存 |
| タグで絞り込む | 左側のタグ一覧からクリック |
| キーワード検索 | 検索欄にキーワードを入力 |
| 優先度をつける | カードの星をクリック |
| テーマ切り替え | 右上の月/太陽アイコンをクリック |
| 言語切り替え | 右上の言語ボタンをクリック |

---

## 次回以降の起動方法

LinkStash を使いたいときは、毎回以下を行います:

**Windows（推奨）:** `start-linkstash.cmd` をダブルクリック

**手動で起動する場合:**
1. コマンドプロンプト / ターミナルを開く
2. LinkStash のフォルダに移動する
3. `python app.py` を実行する
4. ブラウザで `http://localhost:5000` にアクセス

---

## 終了方法

コマンドプロンプト / ターミナルで `Ctrl + C` を押すと停止します。
ブラウザのタブを閉じるだけでもOKですが、バックグラウンドでは動き続けます。

---

## データについて

- 保存したリンクは `data/links.json` に保存されています
- このファイルをバックアップすれば、データを守れます
- クラウドには一切送信されません。すべてあなたのPC内で完結します

---

## うまくいかないときは

| 症状 | 対処法 |
|------|--------|
| `python` が見つからない | Python インストール時に「Add to PATH」にチェックを入れ直す |
| `pip` が見つからない | `python -m pip install -r requirements.txt` を試す |
| ポート 5000 が使用中 | 他のアプリが5000番を使っている。`app.py` の `PORT = 5000` を `5001` に変更 |
| ブラウザが真っ白 | `http://localhost:5000` に手動でアクセス。キャッシュクリア（`Ctrl+Shift+R`）も試す |
| URL情報の取得に失敗 | サイト側の制限です。モーダルが開くので、タイトルを手入力して保存できます |

それでも解決しない場合は [GitHub の Issues](https://github.com/MiraQue/LinkStash/issues) で質問してください。
