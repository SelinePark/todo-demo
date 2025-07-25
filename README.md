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
