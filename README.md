[**English**](README.en.md) | 日本語

# LinkStash

> リンクを保存・タグ付け・検索 — 手軽に、自分だけのブックマーク管理。

![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

LinkStash は、URLを貼るだけでページのタイトル・説明・OGP画像を自動取得し、タグ付け・検索・優先度管理ができるセルフホスト型ブックマークマネージャーです。

クラウド不要。トラッキングなし。データはローカルJSONファイルに保存されます。

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| **メタデータ自動取得** | URLを貼るだけでタイトル・説明・サムネイルを自動取得 |
| **スマートタグ提案** | ドメインやタイトルのキーワードからタグを自動提案 |
| **5段階の優先度** | カード上の星をクリックして重要度を設定（1〜5） |
| **ステータス管理** | 未読 / 既読 / 重要 でリンクを分類 |
| **タグ＆キーワード検索** | タグ（AND検索）やタイトル・URL・概要でフィルタリング |
| **カード / リスト表示** | ビジュアルカードとコンパクトリストを切り替え |
| **ブックマークレット** | ブラウザから1クリックでリンクを保存 |
| **Markdownエクスポート** | タグでフィルタしてMarkdownファイルとして出力 |
| **メモ機能** | 各リンクに個人メモを追加 |
| **ダーク / ライトテーマ** | ワンクリックで切り替え。設定は自動保存 |
| **日本語 / 英語 切り替え** | UIは完全バイリンガル対応 |

---

## スクリーンショット

<!-- スクリーンショットをここに追加 -->

---

## クイックスタート

### 1. クローン＆インストール

```bash
git clone https://github.com/MiraQue/LinkStash.git
cd LinkStash
pip install -r requirements.txt
```

> Python 3.9以上が必要です。まだ入っていない場合は [python.org](https://www.python.org/downloads/) からインストールしてください。

### 2. 起動

```bash
python app.py
```

ブラウザが自動で `http://localhost:5000` を開きます。

### 3. 最初のリンクを保存

上部のURL入力欄にURLを貼り付けてEnter。自動取得された情報を確認し、タグ・優先度を調整して **保存** をクリック。

---

## ブックマークレットの設定

アプリ起動後に `http://localhost:5000/bookmarklet` にアクセスしてください。

**設定方法:**
1. ブックマークレットのコードをコピー（コピーボタンあり）
2. ブラウザのブックマークマネージャー（`Ctrl+Shift+O`）を開く
3. 新しいブックマークを追加し、URL欄にコピーしたコードを貼り付け
4. 任意のWebページでブックマークをクリックすると、LinkStashに保存されます

> **注意**: ブックマークレットを使うにはLinkStashが起動している必要があります。
> Chrome の新しいタブ（`chrome://newtab`）など一部のページでは動作しません。通常の `https://` ページで使用してください。

---

## プロジェクト構成

```
LinkStash/
├── app.py              # Flaskバックエンド & API
├── fetcher.py          # URLメタデータ取得（OGP / metaタグ）
├── tag_engine.py       # 自動タグ提案エンジン
├── index.html          # フロントエンドUI
├── style.css           # スタイル（ダーク/ライトテーマ対応）
├── app.js              # フロントエンドロジック（vanilla JS）
├── bookmarklet.html    # ブックマークレット設定ページ
├── requirements.txt    # Python依存パッケージ
└── data/
    └── links.json      # 保存されたリンク（自動生成、git管理外）
```

---

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|----------|---------------|------|
| `POST` | `/api/fetch` | URLのメタデータを取得（保存前のプレビュー） |
| `GET` | `/api/links` | 保存済みリンク一覧を取得 |
| `POST` | `/api/links` | 新しいリンクを保存 |
| `PUT` | `/api/links/<id>` | リンクを更新（タグ、メモ、ステータス等） |
| `DELETE` | `/api/links/<id>` | リンクを削除 |
| `GET` | `/api/tags` | 全タグを取得 |
| `POST` | `/api/tags` | カスタムタグを追加 |
| `GET` | `/api/export/markdown` | Markdownでエクスポート（`?tags=`でフィルタ可） |

---

## データ形式

リンクは `data/links.json` に保存されます:

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "title": "ページタイトル",
  "summary": "metaディスクリプション...",
  "thumbnail": "https://example.com/og-image.jpg",
  "tags": ["dev", "tutorial"],
  "status": "unread",
  "priority": 3,
  "memo": "キャッシュの章を確認する",
  "created_at": "2026-03-13T12:00:00+09:00"
}
```

- `status`: `"unread"`（未読）| `"read"`（既読）| `"important"`（重要）
- `priority`: `0`（未設定）〜 `5`（最高）

---

## タグエンジン

タグは2つのソースから自動提案されます:

- **ドメインベース**: 40以上のドメインルール（例: `github.com` → `dev, tools, OSS`）
- **キーワードベース**: タイトルと説明文から50以上のキーワードパターンでマッチ

手動でのタグ追加・削除・カスタムタグ作成も自由にできます。

---

## 技術スタック

- **バックエンド**: Python 3.9+ / Flask
- **フロントエンド**: HTML + CSS + JavaScript（ビルド不要）
- **ストレージ**: ローカルJSONファイル（`data/links.json`）
- **メタデータ取得**: `requests` + `BeautifulSoup4`（OGP / metaタグ解析）

---

## 設定

| 項目 | 場所 | デフォルト値 |
|------|------|-------------|
| ポート番号 | `app.py` 21行目 | `5000` |
| データファイル | `app.py` 20行目 | `data/links.json` |
| リクエストタイムアウト | `fetcher.py` 17行目 | `10`秒 |

---

## ライセンス

MIT License. 詳細は [LICENSE](LICENSE) を参照してください。
