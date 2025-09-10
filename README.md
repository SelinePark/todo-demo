## Todo App
### 1. 📌 概要
ToDoリストを作成し、タスクを管理するウェブアプリケーションです。
### 2. 🚀 機能
- Create: タスクの作成
- Read: タスクの確認（読み取り）
- Update: タスクの状況を更新
- Delete: タスクの削除
### 3. ⛏️ 使った技術スタック
- フロントエンド: Bootstrap, React
- バックエンド: Node.js, Express.js
- DB: MongoDB, Mongoose
- デプロイ
  - フロントエンド: Netlify
  - バックエンド: AWS Elastic Beanstalk (AWS IAM, AWS KMS, AWS Systems Manager Parameter Store)
  - DB: MongoDB Atlas
### 4. ⚙️ ディレクトリ構造
```
todolist-demo
├── todo-backend // バックエンド
│   ├── .ebextensions
│   ├── .env
│   ├── Procfile
│   ├── app.js
│   ├── controller
│   ├── model
│   └── routes
├── todo-frontend // フロントエンド
│   ├── public
│   └── src
├── docs
└── README.md
```
### 5. 🛠️ インストールおよび実行方法
```
// 1. リポジトリのclone
git clone https://github.com/SelinePark/todo-demo.git

// 2. フロントエンドのインストールおよび実行
cd todo-frontend
npm install
npm start

// 3. バックエンドのインストール
cd ../ todo-backend
npm install

// 4. 環境変数の設定 (.envファイルの作成)
MONGODB_URI_PROD=${YOUR_MONGODB_URI}

// 5. バックエンドの実行
npm start
```
### 6. 🌐 リンク（2025年08月までに有効：09月にバックエンドリソース削除予定）
https://todolist-demoapp.netlify.app/

### 7. 🔐 環境変数の安全な保存 - AWS Systems Manager Parameter Storeについて

2025年4月から、AWS Elastic BeanstalkをAWS Secrets ManagerやSystems Manager Parameter Storeと連携して利用できるようになりました！  
連携手順の詳細は[docs/deploy-using-ssm.md](https://github.com/SelinePark/todo-demo/blob/main/docs/deploy-using-ssm.md)にてご案内しておりますので、興味のある方はぜひご参考ください！
