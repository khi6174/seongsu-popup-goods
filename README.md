# sk_ai — 성수동 팝업 굿즈 글로벌 쇼핑몰

AI 루키 리그 수강생이 **성수동 팝업스토어 방문객(특히 외국인 관광객)을 겨냥한 굿즈
글로벌 쇼핑몰**을 기획부터 직접 구축하며 학습하는 프로젝트입니다.

## 기술 스택
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 + SQLite ·
Anthropic Claude API. (자세히: `docs/planning/06-tech-stack.md`)

## 실행 방법
```bash
npm install                 # 의존성 설치 (최초 1회)
npx prisma migrate dev      # DB 생성 (최초 1회)
npx tsx prisma/seed.ts      # 시드 데이터(팝업/굿즈) 넣기 (최초 1회)
npm run dev                 # 개발 서버 → http://localhost:3000
```
AI 챗봇/번역을 실제로 쓰려면 `.env`의 `ANTHROPIC_API_KEY`를 채우세요
(비워두면 나머지 기능은 정상 동작, 챗봇은 안내 메시지 폴백).

## 구현된 기능 (MVP)
- 홈(팝업 큐레이션) · 팝업 상세 · 상품 상세 · 장바구니 · 체크아웃(비회원·모의결제) · 주문완료
- 카테고리 탐색(`/shop`) · 한/영 언어 전환 · 가격 KRW+USD 표시
- AI 다국어 쇼핑 챗봇(`/api/chat`) · 상품설명 자동번역(`/api/translate`)

## 폴더 안내
- `src/app/` — 화면(라우트) + `api/`(백엔드)
- `src/components/` — UI 컴포넌트 · `src/lib/` — DB·설정·i18n·AI 등
- `prisma/` — 스키마·마이그레이션·시드
- `docs/` — 기획/설계 문서 & 의사결정·학습 로그 (아래)

## 문서
- [`docs/00-project-overview.md`](docs/00-project-overview.md) — 배경·목표
- [`docs/decision-log.md`](docs/decision-log.md) — 의사결정 로그
- [`docs/learning-log.md`](docs/learning-log.md) — 학습한 개념
- `docs/planning/00~06` — 발굴·컨셉·화면·데이터·IA·시나리오·스택

## 진행 단계
기획 ✅ → 설계 ✅ → **개발(MVP) ✅** → 디자인(무드보드로 UI 입히기) · 실결제/회원(2차)
