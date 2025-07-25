## Todo App
### 1. 📌 한 줄 소개
할 일 리스트를 작성하여 일정을 관리하는 웹 애플리케이션입니다.
### 2. 🚀 주요 기능
- Create: 할 일 작성하기
- Read: 할 일 확인하기
- Update: 할 일의 완료/미완료 여부 수정
- Delete: 할 일 삭제
### 3. ⛏️ 주요 기술 스택
- 프론트엔드: Bootstrap, React
- 백엔드: Node.js, Express.js
- DB: MongoDB, Mongoose
- 배포
  - 프론트엔드: Netlify
  - 백엔드: AWS Elastic Beanstalk (AWS IAM, AWS KMS, AWS Systems Manager Parameter Store)
  - 데이터베이스: MongoDB Atlas
### 4. ⚙️ 프로젝트 구조
```
todolist-demo
├── todo-backend // 백엔드
│   ├── .ebextensions
│   ├── .env
│   ├── Procfile
│   ├── app.js
│   ├── controller
│   ├── model
│   └── routes
├── todo-frontend // 프론트엔드
│   ├── public
│   └── src
└── README.md
```
### 5. 🛠️ 설치 및 실행 방법
```
// 1. 저장소 클론
git clone https://github.com/SelinePark/todo-demo.git

// 2. 프론트엔드 설치 및 실행
cd todo-frontend
npm install
npm start

// 3. 백엔드 설치
cd ../ todo-backend
npm install

// 4. 환경변수 설정 (.env 파일 생성)
MONGODB_URI_PROD=${YOUR_MONGODB_URI}

// 5. 백엔드 실행
npm start
```
### 6. 🌐 배포 링크
https://todolist-demoapp.netlify.app/

### 7. 🔐 안전한 환경 변수의 저장을 위해 - AWS Systems Manager Parameter Store를 이용하기

2025년 4월부터 AWS Elastic Beanstalk을 AWS Secrets Manager, Systems Manager Parameter Store와 연계해서 사용할 수 있게 되었습니다!
Username과 Password가 그대로 들어있는 URI를 평문으로 저장하는 것보다는 암호화해두면 더 좋지 않을까 싶어 Systems Manager Parameter Store를 사용하기로 결정했습니다.  
(AWS Secrets Manager도 물론 좋지만, 유료입니다😂)

적용 방법은 아래와 같습니다.

#### 1. 검색창에 parameter store를 쳐서, 일치하는 서비스로 이동합니다.
#### 2. Create parameter를 눌러 환경변수를 만들어줍니다.
<img width="929" height="356" alt="ssm_create" src="https://github.com/user-attachments/assets/64412811-c47d-4278-ad8c-b80e75897f88" />

- 설정값
  - name은 환경변수 이름이니 ```MONGODB_URI_PROD```를 입력합니다.
  - tier는 **반드시 Standard**를 선택합니다. (Advanced엔 더 많은 기능이 있지만, 유료입니다😂)
  - type은 SecrueString을 입력하면 AWS가 관리하는 키로 암호화를 시켜줍니다. 키는 프리 티어에서 2만 번의 리퀘스트까지 무료입니다.
  - 나머지는 기본값으로 두고 Create parameter를 눌러 환경변수를 저장합니다.
#### 3. 저장한 환경변수와 KMS의 ARN을 메모해둡니다.
<img width="947" height="381" alt="ssm_uri" src="https://github.com/user-attachments/assets/9d4719b9-a756-48f1-8e23-b6e6ad485907" />

- 환경변수 ARN의 메모
  - 우선 새로 만들어진 환경변수 이름을 클릭해, 붉은색으로 표시된 부분을 눌러 ARN을 복사합니다.
  - ARN은 지금 만든 환경변수의 ID 같은 개념인데, 여러 번 쓸 일이 있으니 메모장에 복사하는 등 메모해두는 것이 편합니다.    

- KMS의 ARN 메모
  - 검색창에 Key Management Service를 입력하여 나온 서비스를 클릭해주세요.
<img width="959" height="379" alt="kms_key" src="https://github.com/user-attachments/assets/1376993b-37ff-4f03-aecd-4c95b95ba571" />

좌측 상단의 AWS managed keys를 누르면 위 화면이 뜹니다. aws/ssm이라는 이름의 키가 있을 것입니다. 이를 클릭해서 환경변수와 같은 방식으로 ARN을 복사해 메모해 주세요.

#### 4. 이제 AWS Elastic Beanstalk으로 돌아와, 환경변수 설정에서 Parameter Store를 선택한 후 환경변수의 이름과 ARN을 입력합니다.
<img width="1024" height="287" alt="beanstalk_add" src="https://github.com/user-attachments/assets/337ad5fe-8d71-4b6c-860b-f50bb12c6534" />

(위의 Plain text란이 아닌, 아래의 Parameter Store란처럼 입력하셔야 합니다!)
이미 설정이 끝난 저는 화면에 뜨지 않아 캡처할 수 없었지만, 위 순서대로 진행하면 값을 올바르게 입력해도 아래에 Role과 관련된 경고가 뜰 것입니다.
Parameter Store는 Beanstalk과는 별개의 공간에 환경변수를 따로 암호화해서 저장하는 개념이기 때문에, Beanstalk에서도 복호화된 환경변수를 꺼내 쓸 수 있도록 허락해야 하는데 지금 설정이 그렇게 되어있지 않기 때문입니다.

#### 5. Role의 준비
새 AWS 창을 열어서 IAM을 검색한 후 나온 결과를 클릭하여 AWS IAM 페이지에 들어갑니다.
<img width="947" height="383" alt="ssm_role" src="https://github.com/user-attachments/assets/2dddb673-5477-4834-9872-e90f5cb6c46c" />
[Add Permissions] > [Create inline policy]를 누릅니다.
그 다음은 (화면에 많은 것이 있겠지만 전부 무시하고) JSON을 눌러, 에디터의 내용을 전부 지우고 아래 내용을 입력해 주세요.
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
				"arn:aws:kms:{region}:{account}:key/{kms_arn}", // 따옴표 안에 KMS의 ARN 복붙
				"arn:aws:ssm:{region}:{account}:parameter/{parameter_name}" // 따옴표 안에 환경변수의 ARN 복붙
			]
		}
	]
}
```
그 이외에 아무것도 건드리지 않고 Next 버튼으로 넘어가면 policy name을 지어달라는 항목이 나오는데 적당한 이름으로 지으시면 됩니다. (전 다른 policy들의 이름을 참고해 ```AWSElasticBeanstalkAccessToSecureStringParameter```라고 지었습니다.)

이제 Create policy를 눌러 저장하면 끝입니다!

- 출처
  - https://aws.amazon.com/jp/blogs/dotnet/aws-elastic-beanstalk-now-integrates-with-aws-secrets-manager-and-systems-manager-parameter-store/
