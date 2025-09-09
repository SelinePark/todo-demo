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
UsernameやPasswordを含んだURIを平文で環境変数を保存するよりも、暗号化しておいた方が安心だと思い、今回はSystems Manager Parameter Storeを使うことにしました。
（もちろんAWS Secrets Managerも良いのですが、有料です😂）

連携の手順は以下の通りです。

#### 1. 検索バーで「parameter store」と入力し、一致するサービスに移動します。
#### 2. 「Create parameter」をクリックして環境変数を作成します。
<img width="929" height="356" alt="ssm_create" src="https://github.com/user-attachments/assets/64412811-c47d-4278-ad8c-b80e75897f88" />

- 設定値
  - name：環境変数名なので ```MONGODB_URI_PROD```を入力します。
  - tier：**必ず Standard**を選択してください。（Advancedにはより多くの機能がありますが、有料です😂）
  - type：**SecureString**を選択すると、AWSが管理するキーで暗号化してくれます。キーはfree tierで2万回のリクエストまで無料です。
  - それ以外はデフォルトのままにして、「Create parameter」をクリックして環境変数を保存します。
#### 3. 保存した環境変数とKMSのARNをメモしておきます。
<img width="947" height="381" alt="ssm_uri" src="https://github.com/user-attachments/assets/9d4719b9-a756-48f1-8e23-b6e6ad485907" />

- 環境変数のARNのメモ
  - まず、新しく作成した環境変数の名前をクリックし、赤く表示されている部分をクリックしてARNをコピーします。
  - ARNは今回作成した環境変数のIDのような概念で、今後何度も使うことになるので、メモ帳にコピーするなどして控えておくと便利です。

- KMSのARNのメモ
  - 検索バーで「Key Management Service」と入力し、表示されたサービスをクリックしてください。
<img width="959" height="379" alt="kms_key" src="https://github.com/user-attachments/assets/1376993b-37ff-4f03-aecd-4c95b95ba571" />

左上の「AWS managed keys」をクリックすると、上記の画面が表示されます。
aws/ssmという名前のキーがあるはずです。これをクリックして、環境変数と同じようにARNをコピーし、メモしておいてください。
#### 4. それではAWS Elastic Beanstalkに戻り、環境変数の設定でParameter Storeを選択し、環境変数の名前とARNを入力します。
<img width="1024" height="287" alt="beanstalk_add" src="https://github.com/user-attachments/assets/337ad5fe-8d71-4b6c-860b-f50bb12c6534" />

（1行目のの「Plain text」欄ではなく、2行目の「Parameter Store」欄に入力する必要があります！）
私はすでに設定を終えているため画面には表示されませんが、上記の手順で進めると、値を正しく入力しても下にRoleに関する警告が表示されるはずです。
これは、Parameter StoreがBeanstalkとは別の領域に環境変数を暗号化して保存する仕組みになっており、Beanstalk側でも復号された環境変数を利用できるように許可を与える必要があるためです。

#### 5. Roleの準備
新しいAWSの画面を開き、「IAM」と検索して表示された結果をクリックし、AWS IAMページに入ります。
右上の「Roles」をクリックし、ロールの一覧から「aws-elasticbeanstalk-ec2-role」を選択してください。

<img width="947" height="383" alt="ssm_role" src="https://github.com/user-attachments/assets/2dddb673-5477-4834-9872-e90f5cb6c46c" />

次に、 [Add Permissions] > [Create inline policy] をクリックします。
その後（画面に色々表示されますが全部無視して）、JSON を選択し、エディタの内容をすべて削除して以下の内容を入力してください。

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"kms:Decrypt",
				"ssm:GetParameter"
			],
			"Resource": [
				"arn:aws:kms:{region}:{account}:key/{kms_arn}", // クォーテーションマーク（""）の間にKMSのARNをコピペ
				"arn:aws:ssm:{region}:{account}:parameter/{parameter_name}" // クォーテーションマーク（""）の間に環境変数のARNをコピペ
			]
		}
	]
}
```
上記の手順以外は何も触らずに「Next」ボタンで次に進むと、「policy name」を入力する項目が表示されます。
ここでは適当な名前を付ければ大丈夫です。（私は他のポリシー名を参考にして、```AWSElasticBeanstalkAccessToSecureStringParameter```という名前にしました。）

最後に「Create policy」をクリックして保存すれば完了です！



- 参考
  - https://aws.amazon.com/jp/blogs/dotnet/aws-elastic-beanstalk-now-integrates-with-aws-secrets-manager-and-systems-manager-parameter-store/
