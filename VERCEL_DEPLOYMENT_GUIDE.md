# Vercel + Supabase 배포 가이드

## 🚀 배포 준비 완료!

이 프로젝트는 Vercel에서 Supabase PostgreSQL DB와 함께 구동되도록 설정되었습니다.

## 📋 설정해야 할 환경변수

### Vercel Dashboard에서 설정할 환경변수들:

```bash
# 필수 환경변수
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
COOKIE_SECRET=your-super-secret-cookie-key-here

# Supabase 추가 기능용 (선택사항)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-PUBLISHABLE-KEY]
SUPABASE_SERVICE_KEY=[YOUR-SECRET-KEY]

# 선택사항 (기본값 사용 가능)
PORT=4000
CLIENT_URL=https://your-frontend-domain.com
COOKIE_DOMAIN=.vercel.app
```

## 🗄️ Supabase 설정 방법

1. **Supabase 프로젝트 생성**

   - https://supabase.com 에서 새 프로젝트 생성
   - 데이터베이스 비밀번호 설정

2. **Database URL 복사**

   - Project Settings > Database 이동
   - Connection string 섹션에서 "URI" 복사
   - `[YOUR-PASSWORD]`를 실제 비밀번호로 교체

3. **Supabase 추가 정보 복사 (선택사항)**

   - Project Settings > API 이동
   - Project URL, anon public key(publishable), service_role key(secret) 복사

4. **예시 (실제 프로젝트 정보)**
   ```
   DATABASE_URL: postgresql://postgres:your_password@db.rlecgghggceoslgjjzaa.supabase.co:5432/postgres
   SUPABASE_URL: https://rlecgghggceoslgjjzaa.supabase.co
   SUPABASE_ANON_KEY: sb_publishable_8L3Q-zAbJbNsvcUHkhPg9A_DKjyDC-Z
   SUPABASE_SERVICE_KEY: sb_secret_q4gDth2tWoB8poHD8ryZWw_Qp30RT18
   ```

## 🚀 Vercel 배포 방법

1. **Vercel에 프로젝트 연결**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **환경변수 설정**

   - Vercel Dashboard > Settings > Environment Variables
   - 위의 환경변수들을 추가

3. **배포**
   ```bash
   vercel --prod
   ```

## 🔧 로컬 개발 환경 설정

로컬에서 개발할 때는 `.env` 파일을 생성하세요:

```bash
# .env 파일
NODE_ENV=development
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/your_dev_db
COOKIE_SECRET=your-dev-cookie-secret

# Supabase 추가 기능용 (선택사항)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_KEY=your-secret-key
```

## 📦 패키지 설치

PostgreSQL과 Supabase 지원을 위한 새 패키지들이 추가되었습니다:

```bash
yarn install
# 또는
npm install
```

## 🔄 주요 변경사항

1. **데이터베이스**: MySQL → PostgreSQL (Supabase)
2. **배포 환경**: 일반 서버 → Vercel Serverless
3. **설정**: 환경변수 기반 구성
4. **빌드**: TypeScript 컴파일 후 배포
5. **Supabase 통합**: 실시간 기능, 인증 등 추가 기능 지원

## ⚠️ 주의사항

- 프로덕션에서는 `synchronize: false`로 설정됨 (데이터 안전성)
- SSL 연결이 자동으로 설정됨 (Supabase 요구사항)
- Serverless 환경에 맞게 최적화됨

## 🔍 문제 해결

### 1. DB 연결 오류

- DATABASE_URL이 올바른지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 2. CORS 오류

- CLIENT_URL이 올바르게 설정되어 있는지 확인
- 프론트엔드 도메인과 일치하는지 확인

### 3. 세션/쿠키 문제

- COOKIE_SECRET이 설정되어 있는지 확인
- COOKIE_DOMAIN이 배포 도메인과 맞는지 확인
