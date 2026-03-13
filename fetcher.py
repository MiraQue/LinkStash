"""
LinkStash — fetcher.py
URLからOGP情報・メタ情報を取得するモジュール
"""
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}
TIMEOUT = 10


def fetch_url_info(url: str) -> dict:
    """
    URLからタイトル・概要・サムネイルURLを取得して返す
    失敗時はデフォルト値を返す
    """
    result = {
        "url": url,
        "title": "",
        "summary": "",
        "thumbnail": "",
        "domain": urlparse(url).netloc,
        "error": None,
    }

    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # --- タイトル取得 ---
        og_title = soup.find("meta", property="og:title")
        tw_title = soup.find("meta", attrs={"name": "twitter:title"})
        tag_title = soup.find("title")

        if og_title and og_title.get("content"):
            result["title"] = og_title["content"].strip()
        elif tw_title and tw_title.get("content"):
            result["title"] = tw_title["content"].strip()
        elif tag_title:
            result["title"] = tag_title.get_text().strip()

        # --- 概要取得 ---
        og_desc = soup.find("meta", property="og:description")
        meta_desc = soup.find("meta", attrs={"name": "description"})
        tw_desc = soup.find("meta", attrs={"name": "twitter:description"})

        if og_desc and og_desc.get("content"):
            result["summary"] = og_desc["content"].strip()[:200]
        elif meta_desc and meta_desc.get("content"):
            result["summary"] = meta_desc["content"].strip()[:200]
        elif tw_desc and tw_desc.get("content"):
            result["summary"] = tw_desc["content"].strip()[:200]

        # --- サムネイル取得 ---
        og_image = soup.find("meta", property="og:image")
        tw_image = soup.find("meta", attrs={"name": "twitter:image"})

        if og_image and og_image.get("content"):
            thumbnail = og_image["content"].strip()
            result["thumbnail"] = urljoin(url, thumbnail)
        elif tw_image and tw_image.get("content"):
            thumbnail = tw_image["content"].strip()
            result["thumbnail"] = urljoin(url, thumbnail)

    except requests.exceptions.Timeout:
        result["error"] = "タイムアウト"
        result["title"] = urlparse(url).netloc
    except requests.exceptions.ConnectionError:
        result["error"] = "接続エラー"
        result["title"] = urlparse(url).netloc
    except requests.exceptions.HTTPError as e:
        result["error"] = f"HTTPエラー: {e.response.status_code}"
        result["title"] = urlparse(url).netloc
    except Exception as e:
        result["error"] = f"取得失敗: {str(e)}"
        result["title"] = urlparse(url).netloc

    # タイトルが空の場合はドメイン名を使用
    if not result["title"]:
        result["title"] = result["domain"]

    return result
