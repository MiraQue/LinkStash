# LinkStash フィードバックメモ

## 発生した現象

### 1. Windows 環境でアプリ起動直後に落ちることがあった

- `python app.py` で起動しても、`http://127.0.0.1:5000` に繋がらないことがあった
- 調査時の実際の例外は `UnicodeEncodeError` だった
- 原因は、起動時の日本語 `print()` が Windows の `cp1252` 系コンソール文字コードで出力できず、Flask サーバー起動前にプロセスが終了していたこと

発生箇所:
- `app.py` の `if __name__ == "__main__":` にある起動メッセージ出力

### 2. 起動時のブラウザ自動オープンが不安定要因になった

- `webbrowser.open("http://localhost:5000")` が起動時に走る実装だった
- 利用環境では `chrome.exe - Fehler in Anwendung` のダイアログが出ることがあった
- 例外内容は `unknown software exception (0x80000003)` だった
- ブラウザ側クラッシュのため、LinkStash 側の保存処理そのものとは切り分けが必要

発生箇所:
- `app.py` の `open_browser()`
- `app.py` の起動時 `Timer(1.0, open_browser).start()`

### 3. URLメタデータ取得に失敗すると、ユーザーが登録に進みにくかった

- `https://antigravity.google/download` を含め、複数URLで `URL情報の取得に失敗しました` が表示された
- サーバー側で `/api/fetch` を直接叩くと、少なくとも一部URLでは 500 ではなく正常にレスポンスは返っており、内容は以下のようなフォールバックだった

```json
{
  "domain": "antigravity.google",
  "error": "接続エラー",
  "suggested_tags": [],
  "summary": "",
  "thumbnail": "",
  "title": "antigravity.google",
  "url": "https://antigravity.google/download"
}
```

- つまり「リンク自体の保存不可」ではなく、「外部サイトのメタデータ取得失敗」が主原因だった
- ただしフロント側では失敗時にトースト表示だけになり、ユーザー視点では「登録できない」に見えやすかった

発生箇所:
- `fetcher.py` の `requests.get(...)`
- `app.js` の `startAddLink()` のエラーハンドリング

### 4. ブラウザキャッシュで修正済みの `app.js` が反映されにくかった

- 修正後も旧挙動が残ることがあった
- `localhost` 配信でもキャッシュが強く残っていた可能性がある

発生箇所:
- `index.html` の `style.css` / `app.js` 読み込み

## こちらで行った対処

### 起動安定化

- `app.py` の起動ログを ASCII のみのメッセージに変更
- `webbrowser.open()` を `try/except` で保護
- ブラウザ自動起動は常時実行ではなく、`LINKSTASH_OPEN_BROWSER=1` のときだけ実行するよう変更

### フェッチ失敗時でも保存に進めるよう改善

- `app.py` の `/api/fetch` で、万一 `fetch_url_info()` や `suggest_tags()` 側で予期しない例外が出ても JSON を返すように保護
- `app.js` の `startAddLink()` で、`/api/fetch` が失敗した場合も空のプレビュー情報を使って登録モーダルを開くよう変更
- これにより、OGP 取得に失敗しても手入力でタイトルやメモを補って保存できるようにした

### キャッシュ回避

- `index.html` の `style.css` と `app.js` にクエリ文字列を付け、更新後のファイルが読み込まれやすいようにした

### ローカル起動しやすさ改善

- `start-linkstash.cmd` を追加
- ダブルクリック、またはターミナルからこのファイルを実行するだけで起動できるようにした
- このランチャーでは `LINKSTASH_OPEN_BROWSER=1` を設定してから起動する

## 開発元で直すとよさそうな点

### 優先度: 高

- Windows コンソールの文字コード差異で落ちないようにする
- 起動時のブラウザ自動オープンはデフォルトで無効、または設定制にする
- `/api/fetch` 失敗時でも「保存は続行できます」という UI にする

### 優先度: 中

- `fetcher.py` の接続失敗理由を UI でも見えるようにする
- フロントで「メタデータ取得失敗」と「保存失敗」を別メッセージに分ける
- 静的ファイルに簡単なキャッシュバスターを入れる

### 優先度: あると便利

- Windows 用の `start.bat` / `start.cmd` をリポジトリに同梱する
- 初回起動時に `localhost` を開けなかった場合の案内を README に追加する
- `docs/setup-guide-ja.md` に「メタデータ取得に失敗しても手動保存できる」旨を明記する
