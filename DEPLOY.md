# Vercel デプロイガイド

## 1. Neon PostgreSQL データベースの作成

1. [Neon](https://neon.tech/) にアクセスしてサインアップ
2. 「New Project」をクリック
3. プロジェクト名を入力（例: `astrobook-db`）
4. 「Create」をクリック
5. 接続文字列をコピー（`.env`ファイルに貼り付け用）

接続文字列の例:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

## 2. Vercel にデプロイ

### 方法1: Vercel CLI を使用

```bash
# Vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel
```

### 方法2: GitHub から自動デプロイ

1. リポジトリを GitHub にプッシュ
2. [Vercel](https://vercel.com/) で「New Project」
3. GitHub リポジトリを選択
4. 環境変数を設定:
   - `DATABASE_URL` = Neon の接続文字列
5. 「Deploy」をクリック

## 3. 環境変数の設定

Vercel ダッシュボードで設定:
- Settings → Environment Variables
- `DATABASE_URL` を追加

または、`.env` ファイルを作成:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

## 4. データベース マイグレーション

デプロイ後に一度だけ実行:
```bash
npm run db:migrate
```

または Vercel 上で自動実行するには、`next.config.ts` に設定を追加。

## 5. カスタム ドメイン（オプション）

Vercel ダッシュボード → Domains → カスタムドメインを追加
