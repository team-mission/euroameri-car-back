# 🚀 빠른 Vercel 배포 가이드

## ⚡ 1분 배포 체크리스트

### 1. 필수 환경변수만 설정 (Vercel Dashboard)

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[YOUR-DB-PASSWORD]@db.rlecgghggceoslgjjzaa.supabase.co:5432/postgres
COOKIE_SECRET=your-32-character-secret-key-here
```

**중요**: `[YOUR-DB-PASSWORD]`를 Supabase 데이터베이스 실제 비밀번호로 교체하세요!

### 2. 패키지 설치 & 배포

```bash
# 패키지 설치
yarn install

# 프로덕션 배포
yarn deploy

# 또는 미리보기 배포
yarn deploy:preview
```

## ✅ 그게 끝!

Supabase URL과 API 키들은 이미 코드에 설정되어 있어서 추가 환경변수 설정이 필요 없습니다.

## 🔧 추가 설정 (선택사항)

필요에 따라 Vercel 환경변수에 추가할 수 있습니다:

```bash
CLIENT_URL=https://your-frontend-domain.com
COOKIE_DOMAIN=.your-domain.com
```

## 🗄️ Supabase 데이터베이스 비밀번호 찾기

1. https://supabase.com 로그인
2. 프로젝트 선택
3. Settings > Database
4. Connection string에서 비밀번호 확인

## 🎯 배포 후 확인사항

1. Vercel 배포 URL에 접속
2. `/` 경로에서 "Welcome to My Server!" 메시지 확인
3. API 엔드포인트들이 정상 작동하는지 확인

## 🔍 문제 해결

- **DB 연결 오류**: DATABASE_URL의 비밀번호 확인
- **빌드 오류**: `yarn build` 로컬에서 테스트
- **함수 타임아웃**: vercel.json의 maxDuration 증가
