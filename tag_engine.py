"""
LinkStash — tag_engine.py
URL・ドメイン・タイトルからタグ候補を自動推定するモジュール
"""
from urllib.parse import urlparse


# ドメインベースのタグ辞書
DOMAIN_TAGS = {
    "github.com": ["開発", "ツール", "OSS"],
    "gitlab.com": ["開発", "ツール", "OSS"],
    "qiita.com": ["技術記事", "開発"],
    "zenn.dev": ["技術記事", "開発"],
    "note.com": ["記事", "ブログ"],
    "medium.com": ["記事", "英語"],
    "dev.to": ["技術記事", "英語", "開発"],
    "stackoverflow.com": ["開発", "Q&A"],
    "unity.com": ["Unity"],
    "assetstore.unity.com": ["Unity", "アセット"],
    "docs.unity3d.com": ["Unity", "ドキュメント"],
    "vrchat.com": ["VRChat"],
    "cluster.mu": ["Cluster"],
    "youtube.com": ["動画", "YouTube"],
    "youtu.be": ["動画", "YouTube"],
    "twitter.com": ["SNS"],
    "x.com": ["SNS"],
    "notion.so": ["ドキュメント", "ツール"],
    "figma.com": ["デザイン", "ツール"],
    "canva.com": ["デザイン", "ツール"],
    "docs.google.com": ["ドキュメント", "Google"],
    "drive.google.com": ["ファイル", "Google"],
    "amazon.co.jp": ["EC", "購入"],
    "amazon.com": ["EC", "購入"],
    "booth.pm": ["販売", "同人"],
    "store.steampowered.com": ["ゲーム", "Steam"],
    "itch.io": ["ゲーム", "インディー"],
    "openai.com": ["AI", "ChatGPT"],
    "anthropic.com": ["AI", "Claude"],
    "huggingface.co": ["AI", "機械学習"],
}

# タイトル・概要のキーワードベースのタグ辞書
KEYWORD_TAGS = {
    "VRChat": ["VRChat"],
    "Cluster": ["Cluster"],
    "Unity": ["Unity"],
    "Unreal": ["Unreal Engine"],
    "シェーダー": ["シェーダー", "Unity"],
    "Shader": ["シェーダー"],
    "UdonSharp": ["VRChat", "UdonSharp", "Unity"],
    "Udon": ["VRChat", "Unity"],
    "マーケティング": ["マーケティング", "ビジネス"],
    "SEO": ["SEO", "マーケティング"],
    "ビジネス": ["ビジネス"],
    "事業": ["ビジネス"],
    "起業": ["起業", "ビジネス"],
    "デザイン": ["デザイン"],
    "UI": ["デザイン", "UI/UX"],
    "UX": ["デザイン", "UI/UX"],
    "Python": ["Python", "開発"],
    "JavaScript": ["JavaScript", "開発"],
    "TypeScript": ["TypeScript", "開発"],
    "React": ["React", "開発"],
    "Vue": ["Vue", "開発"],
    "AI": ["AI"],
    "機械学習": ["AI", "機械学習"],
    "ChatGPT": ["AI", "ChatGPT"],
    "Claude": ["AI", "Claude"],
    "Stable Diffusion": ["AI", "画像生成"],
    "画像生成": ["AI", "画像生成"],
    "チュートリアル": ["チュートリアル"],
    "Tutorial": ["チュートリアル"],
    "入門": ["入門", "チュートリアル"],
    "ゲーム": ["ゲーム"],
    "Game": ["ゲーム"],
    "音楽": ["音楽"],
    "Music": ["音楽"],
    "3D": ["3D"],
    "アニメ": ["アニメ"],
    "イラスト": ["イラスト", "デザイン"],
    "HP": ["Webサイト"],
    "WordPress": ["WordPress", "Webサイト"],
    "無料": ["無料"],
    "フリー": ["無料"],
    "Free": ["無料"],
    "ニュース": ["ニュース"],
    "News": ["ニュース"],
}


def suggest_tags(url: str, title: str = "", summary: str = "") -> list[str]:
    """
    URL・タイトル・概要からタグ候補を推定して返す（重複なし）
    """
    tags = set()
    domain = urlparse(url).netloc.lower()

    # ドメインベース
    for d, t_list in DOMAIN_TAGS.items():
        if d in domain:
            tags.update(t_list)
            break

    # キーワードベース（タイトル + 概要を検索対象）
    combined = f"{title} {summary}"
    for keyword, t_list in KEYWORD_TAGS.items():
        if keyword.lower() in combined.lower():
            tags.update(t_list)

    return sorted(tags)
