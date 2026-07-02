# 06 · 기술 스택 (Tech Stack)  — v1.0

> 개발 단계 진입 문서. 초심자가 **하나의 생태계 안에서 프론트·백엔드·DB·AI를 모두**
> 배우도록, 학습 곡선이 완만하고 자료가 풍부하며 AI 연동이 쉬운 조합으로 정했다.

## 확정 스택
| 영역 | 선택 | 이유(초심자 관점) |
|------|------|------------------|
| 언어 | **TypeScript** | 타입으로 실수를 미리 잡아줌. 프론트/백 한 언어. |
| 프레임워크 | **Next.js (App Router)** | 프론트+백엔드(API/Server Actions)를 **한 프로젝트**에서. 자료 최다. |
| UI 스타일 | **Tailwind CSS** | 클래스로 빠르게 스타일링, 디자인 시스템 잡기 쉬움. |
| 다국어 | **next-intl** | 한/영 전환(G2)을 표준적으로 처리. |
| DB + ORM | **Prisma + SQLite**(개발) | 스키마를 코드로 관리, 설치 없이 파일 DB로 시작. 나중에 Postgres/Supabase로 이전. |
| AI | **Anthropic Claude API** (`@anthropic-ai/sdk`) | 챗봇(G1)·상품설명 자동번역. 챗봇=`claude-sonnet-5`, 번역=`claude-haiku-4-5`. |
| 배포 | **Vercel**(이후) | Next.js와 궁합 최고, 무료로 시작. |
| 패키지 매니저 | **npm** | 기본값, 추가 학습 부담 없음. |

## 폴더 구조(예정, App Router 기준)
```
src/
├── app/                # 라우트(화면 S1~S6) + api/
│   ├── page.tsx                 # S1 홈
│   ├── popups/[slug]/page.tsx   # S2 팝업 상세
│   ├── products/[slug]/page.tsx # S3 상품 상세
│   ├── cart/ , checkout/ , order/[id]/   # S4~S6
│   └── api/chat/ , api/translate/        # G1, 번역
├── components/         # 재사용 UI(헤더, 챗봇 위젯 등)
├── lib/                # ai(claude), db(prisma), i18n, 배송비/환율 상수
├── messages/           # ko.json / en.json (next-intl)
prisma/schema.prisma    # 데이터 모델(03) → 실제 스키마
```

## 이 스택으로 MVP 6기능 매핑
- 팝업 큐레이션·상품·장바구니·주문 → Next.js 화면 + Prisma
- 모의결제 → 실제 PG 없이 Order 생성(status=CREATED)
- 한/영 → next-intl
- AI 챗봇·번역 → Claude API

## 참고
- Claude API 사용법·모델 ID·요금은 `/claude-api` 스킬 및 `docs/learning-log.md` 참고.
- 실제 코드가 필요해지면 각 영역 **전담 서브 에이전트**(`.claude/agents/`)에 위임.

---
_v1.0 · 2026-07-02 · 다음: 프로젝트 초기 세팅 → 화면 개발_
