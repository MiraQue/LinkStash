"""
LinkStash — app.py
FlaskバックエンドサーバーとAPIエンドポイント
"""
import json
import os
import uuid
import webbrowser
from datetime import datetime, timezone, timedelta
from threading import Timer

from flask import Flask, jsonify, request, send_from_directory
from fetcher import fetch_url_info
from tag_engine import suggest_tags

# ────────────────────────────────────────────
# 設定
# ────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data", "links.json")
PORT = 5000
JST = timezone(timedelta(hours=9))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")


# ────────────────────────────────────────────
# データ操作ヘルパー
# ────────────────────────────────────────────
def load_data() -> dict:
    if not os.path.exists(DATA_FILE):
        return {"links": [], "custom_tags": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data: dict):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def now_jst() -> str:
    return datetime.now(JST).isoformat()


# ────────────────────────────────────────────
# ルート — フロントエンド配信
# ────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/bookmarklet")
def bookmarklet():
    return send_from_directory(BASE_DIR, "bookmarklet.html")


# ────────────────────────────────────────────
# API — URL情報取得（登録前プレビュー）
# ────────────────────────────────────────────
@app.route("/api/fetch", methods=["POST"])
def api_fetch():
    body = request.get_json(silent=True) or {}
    url = (body.get("url") or "").strip()
    if not url:
        return jsonify({"error": "URLが指定されていません"}), 400

    info = fetch_url_info(url)
    tags = suggest_tags(url, info.get("title", ""), info.get("summary", ""))
    info["suggested_tags"] = tags
    return jsonify(info)


# ────────────────────────────────────────────
# API — リンク一覧取得
# ────────────────────────────────────────────
@app.route("/api/links", methods=["GET"])
def api_get_links():
    data = load_data()
    return jsonify(data["links"])


# ────────────────────────────────────────────
# API — リンク登録
# ────────────────────────────────────────────
@app.route("/api/links", methods=["POST"])
def api_add_link():
    body = request.get_json(silent=True) or {}
    url = (body.get("url") or "").strip()
    if not url:
        return jsonify({"error": "URLが必要です"}), 400

    data = load_data()

    # 重複チェック
    for link in data["links"]:
        if link["url"] == url:
            return jsonify({"error": "このURLはすでに登録されています", "existing": link}), 409

    new_link = {
        "id": str(uuid.uuid4()),
        "url": url,
        "title": body.get("title", ""),
        "summary": body.get("summary", ""),
        "thumbnail": body.get("thumbnail", ""),
        "tags": body.get("tags", []),
        "status": "unread",
        "priority": max(0, min(5, int(body.get("priority", 0)))),
        "memo": body.get("memo", ""),
        "created_at": now_jst(),
    }

    data["links"].insert(0, new_link)
    save_data(data)
    return jsonify(new_link), 201


# ────────────────────────────────────────────
# API — リンク更新（タグ・メモ・ステータス）
# ────────────────────────────────────────────
@app.route("/api/links/<link_id>", methods=["PUT"])
def api_update_link(link_id):
    body = request.get_json(silent=True) or {}
    data = load_data()

    for link in data["links"]:
        if link["id"] == link_id:
            if "tags" in body:
                link["tags"] = body["tags"]
            if "memo" in body:
                link["memo"] = body["memo"]
            if "status" in body:
                link["status"] = body["status"]
            if "title" in body:
                link["title"] = body["title"]
            if "summary" in body:
                link["summary"] = body["summary"]
            if "priority" in body:
                link["priority"] = max(0, min(5, int(body["priority"])))
            save_data(data)
            return jsonify(link)

    return jsonify({"error": "リンクが見つかりません"}), 404


# ────────────────────────────────────────────
# API — リンク削除
# ────────────────────────────────────────────
@app.route("/api/links/<link_id>", methods=["DELETE"])
def api_delete_link(link_id):
    data = load_data()
    original_count = len(data["links"])
    data["links"] = [l for l in data["links"] if l["id"] != link_id]

    if len(data["links"]) == original_count:
        return jsonify({"error": "リンクが見つかりません"}), 404

    save_data(data)
    return jsonify({"success": True})


# ────────────────────────────────────────────
# API — カスタムタグ一覧
# ────────────────────────────────────────────
@app.route("/api/tags", methods=["GET"])
def api_get_tags():
    data = load_data()
    # 登録済みリンクのタグ + カスタムタグを集約
    all_tags = set(data.get("custom_tags", []))
    for link in data["links"]:
        all_tags.update(link.get("tags", []))
    return jsonify(sorted(all_tags))


# ────────────────────────────────────────────
# API — カスタムタグ追加
# ────────────────────────────────────────────
@app.route("/api/tags", methods=["POST"])
def api_add_tag():
    body = request.get_json(silent=True) or {}
    tag = (body.get("tag") or "").strip()
    if not tag:
        return jsonify({"error": "タグ名が必要です"}), 400

    data = load_data()
    if tag not in data["custom_tags"]:
        data["custom_tags"].append(tag)
        save_data(data)
    return jsonify({"success": True})


# ────────────────────────────────────────────
# API — エクスポート（Markdown）
# ────────────────────────────────────────────
@app.route("/api/export/markdown", methods=["GET"])
def api_export_markdown():
    from flask import Response
    tags_param = request.args.get("tags", "")
    filter_tags = [t.strip() for t in tags_param.split(",") if t.strip()]

    data = load_data()
    links = data["links"]

    # タグフィルター（AND条件）
    if filter_tags:
        links = [l for l in links if all(t in l.get("tags", []) for t in filter_tags)]

    # Markdown生成
    today = datetime.now(JST).strftime("%Y-%m-%d")
    if filter_tags:
        title = f"[{' / '.join(filter_tags)}] リンク集（{today}）"
    else:
        title = f"LinkStash — 全リンク（{today}）"

    lines = [f"# {title}", ""]
    for l in links:
        tags_str = " ".join(f"#{t}" for t in l.get("tags", []))
        summary = l.get("summary", "").replace("\n", " ").strip()
        summary_part = f" — {summary}" if summary else ""
        lines.append(f"- [{l.get('title') or l['url']}]({l['url']}){summary_part} {tags_str}".rstrip())

    md_content = "\n".join(lines) + "\n"
    filename = f"linkstash_{today}.md"

    return Response(
        md_content,
        mimetype="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{filename}"}
    )


# ────────────────────────────────────────────
# 起動
# ────────────────────────────────────────────
def open_browser():
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    print(f"LinkStash を起動中... http://localhost:{PORT}")
    # 1秒後にブラウザを開く
    Timer(1.0, open_browser).start()
    app.run(host="127.0.0.1", port=PORT, debug=False)
