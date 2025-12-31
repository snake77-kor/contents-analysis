# English Content Analysis Tool (영어 지문 분석기)

이 프로젝트는 영어 지문을 입력받아 문법, 문맥 분석 및 학습 자료(워크북, 변형 문제 등)를 자동으로 생성해주는 React 기반 웹 애플리케이션입니다. Google Gemini API를 활용하여 텍스트를 분석합니다.

## 주요 기능
- **영어 지문 분석**: 문장별 해석, 핵심 어휘, 문법 포인트, 주제문 찾기
- **흐름 정리 (Flow Chart)**: 글의 논리적 전개 과정을 시각적으로 정리
- **After Reading Activities**: 
  - 캐릭터가 연기하는 상황 극(Prompt) 생성
  - True/False 문제 자동 생성
  - 지문 요약 및 변형 문제
- **PDF/HTML 내보내기**: 분석 결과를 수업 자료로 바로 쓸 수 있게 다운로드

## 🚀 다른 컴퓨터에서 사용 및 작업하는 방법

이 코드를 GitHub에 올린 후, 다른 컴퓨터에서 내려받아 작업하려면 다음 단계를 따르세요.

### 1. 필수 프로그램 설치
새로운 컴퓨터에 다음 프로그램들이 설치되어 있어야 합니다.
- **Node.js**: [https://nodejs.org/](https://nodejs.org/) 에서 다운로드 (LTS 버전 추천)
- **Git**: [https://git-scm.com/](https://git-scm.com/) 에서 다운로드
- **VS Code**: 코드 편집기 (선택 사항)

### 2. 코드 내려받기 (Clone)
터미널(또는 명령 프롬프트, Git Bash)을 열고, 작업하고 싶은 폴더로 이동한 뒤 다음 명령어를 입력하세요.
(자신의 GitHub 저장소 주소를 `<REPO_URL>` 자리에 넣어야 합니다.)

```bash
git clone <GITHUB_REPOSITORY_URL>
cd english-contents-analysis
```

### 3. 라이브러리 설치
프로젝트 폴더 안에서 다음 명령어를 실행하여 필요한 도구들을 설치합니다.

```bash
npm install
```

### 4. API 키 설정 (중요!)
보안을 위해 API 키는 GitHub에 올라가지 않습니다. 따라서 **새로운 컴퓨터마다 `.env` 파일을 직접 만들어야 합니다.**

1. 프로젝트 최상위 폴더(package.json이 있는 곳)에 `.env` 라는 이름의 새 파일을 만듭니다.
2. 그 파일 안에 다음 내용을 적고 저장합니다.

```env
VITE_API_KEY=여기에_당신의_GEMINI_API_키를_붙여넣으세요
```

### 5. 실행하기
설정이 끝났으면 앱을 실행합니다.

```bash
npm run dev
```
브라우저가 열리고 `http://localhost:5173/` 주소에서 앱을 사용할 수 있습니다.

## GitHub에 업로드하는 방법 (최초 1회)
이 프로젝트를 처음 GitHub에 올릴 때는 다음 명령어를 사용하세요.

1. GitHub 웹사이트에서 새 저장소(New Repository)를 만듭니다.
2. 다음 명령어를 순서대로 터미널에 입력합니다.

```bash
git init
git add .
git commit -m "Initial commit: 영어 지문 분석기 완성 ver 1.0"
git branch -M main
git remote add origin <GITHUB_URL>  # GitHub에서 만든 저장소 주소
git push -u origin main
```
