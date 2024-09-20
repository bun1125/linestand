#!/bin/bash

# プロジェクトのルートディレクトリを作成
mkdir -p "my-next-app"
cd "my-next-app"

# public ディレクトリとファイルの作成
mkdir -p "public"
touch "public/favicon.ico"
# その他の静的ファイルを public に追加
# 例: touch "public/robots.txt" "public/sitemap.xml"

# app ディレクトリとサブディレクトリの作成
mkdir -p "app/(auth)/login"
mkdir -p "app/(dashboard)/[accountId]/dashboard"
mkdir -p "app/(dashboard)/[accountId]/chat"
mkdir -p "app/(dashboard)/[accountId]/message"
mkdir -p "app/(dashboard)/[accountId]/reader-analysis"
mkdir -p "app/(dashboard)/[accountId]/message-analysis"
mkdir -p "app/(dashboard)/[accountId]"
mkdir -p "app/admin"

# app ディレクトリ内のファイル作成
touch "app/(auth)/login/page.tsx"
touch "app/(dashboard)/[accountId]/dashboard/page.tsx"
touch "app/(dashboard)/[accountId]/chat/page.tsx"
touch "app/(dashboard)/[accountId]/message/page.tsx"
touch "app/(dashboard)/[accountId]/reader-analysis/page.tsx"
touch "app/(dashboard)/[accountId]/message-analysis/page.tsx"
touch "app/(dashboard)/[accountId]/layout.tsx"
touch "app/admin/page.tsx"
touch "app/layout.tsx"
touch "app/page.tsx"
touch "app/not-found.tsx"

# components ディレクトリとサブディレクトリの作成
mkdir -p "components/ui"
mkdir -p "components/layouts"

# components 内のファイル作成
touch "components/ui/Sidebar.tsx"
touch "components/ui/Header.tsx"
touch "components/ui/AccountSelector.tsx"
# その他のUIコンポーネントを components/ui に追加
# 例: touch "components/ui/Button.tsx" "components/ui/Card.tsx"
touch "components/layouts/DashboardLayout.tsx"

# lib ディレクトリとファイルの作成
mkdir -p "lib"
touch "lib/utils.ts"
touch "lib/auth.ts"
touch "lib/firebase.ts"
touch "lib/api.ts"

# hooks ディレクトリとファイルの作成
mkdir -p "hooks"
touch "hooks/useAuth.ts"
touch "hooks/useAccount.ts"
# その他のカスタムフックを hooks に追加
# 例: touch "hooks/useFetch.ts" "hooks/useForm.ts"

# context ディレクトリとファイルの作成
mkdir -p "context"
touch "context/AccountContext.tsx"

# types ディレクトリとファイルの作成
mkdir -p "types"
touch "types/models.ts"
# その他の型定義ファイルを types に追加
# 例: touch "types/api.d.ts" "types/index.d.ts"

# services ディレクトリとファイルの作成
mkdir -p "services"
touch "services/lineApi.ts"
touch "services/firestore.ts"
touch "services/admin.ts"

# ルートファイルの作成
touch ".env.local"
touch ".gitignore"
touch "package.json"
touch "next.config.js"
touch "tsconfig.json"
touch "README.md"

# 初期内容の追加（例として README.md に基本的な内容を追加）
cat <<EOL > README.md
# My Next App

このプロジェクトはNext.jsを使用したアプリケーションです。

## セットアップ

1. リポジトリをクローンします。

\`\`\`bash
git clone https://github.com/your-repo/my-next-app.git
cd my-next-app
\`\`\`

2. 依存関係をインストールします。

\`\`\`bash
npm install
\`\`\`

3. 環境変数を設定します。 \`.env.local\` ファイルを作成し、必要な変数を追加してください。

4. 開発サーバーを起動します。

\`\`\`bash
npm run dev
\`\`\`

## ディレクトリ構造

- \`app/\` - Next.jsのページとレイアウト
- \`components/\` - 再利用可能なReactコンポーネント
- \`lib/\` - ユーティリティ関数やAPIサービス
- \`hooks/\` - カスタムReactフック
- \`context/\` - Reactコンテキスト
- \`types/\` - TypeScriptの型定義
- \`services/\` - 外部サービスとの連携

## スクリプト

- \`npm run dev\` - 開発サーバーを起動
- \`npm run build\` - 本番用にビルド
- \`npm run start\` - 本番ビルドを起動
- \`npm run lint\` - ESLintを実行

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。
EOL

echo "ディレクトリとファイルの作成が完了しました。"