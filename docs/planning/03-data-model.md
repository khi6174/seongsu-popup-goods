# 03 · 데이터 모델 초안 (Data Model)  — v1.0

> 기획 3단계 산출물. 화면 목록(`02`)의 "필요한 데이터"를 실제 **저장 구조(테이블)**로
> 옮긴 것. 아직 코드가 아니라 "무엇을 어떤 모양으로 저장할지"의 설계도다.
> 필드명은 개발에서 쓰기 좋게 영어로, 설명은 한국어로 단다.
>
> **초심자 메모**: 데이터 모델 = "엑셀 시트 여러 장"이라 생각하면 쉽다. 각 표(엔티티)가
> 시트 한 장, 각 필드가 열(column), 각 행이 실제 데이터 한 건. 표끼리 "이 상품은 저
> 팝업 소속"처럼 연결(관계)한다.

## 엔티티 관계 한눈에 보기
```
[Popup 팝업] 1 ────< [Product 상품] 1 ────< [OrderItem 주문상세]
                          │  ▲                      │
                     (담김)│  │(스냅샷 참조)          │ 소속
                          ▼  │                      ▼
                   [CartItem 장바구니항목]      [Order 주문] 1 ────< OrderItem
   * 1 ────< N  =  "하나의 팝업에 여러 상품" 같은 1:다 관계
   * 장바구니(Cart)는 비회원이라 로그인 대신 브라우저 세션에 묶인다
```

## 1) Popup (팝업)
성수동에서 열리는 팝업 하나. 홈·팝업상세 화면의 뼈대.
| 필드 | 타입 | 설명 |
|------|------|------|
| id | ID(PK) | 고유 번호 |
| slug | string | URL용 이름 (예: `cheese-cat`) |
| name_ko / name_en | string | 팝업 이름 (한/영) |
| description_ko / description_en | text | 팝업 소개 (한/영) |
| brand | string | 팝업 운영 브랜드명 |
| thumbnail_url | string | 대표 이미지 |
| start_date / end_date | date | 팝업 기간 |
| location | string | 성수동 내 세부 장소(선택) |
| status | enum | `OPEN` / `CLOSING_SOON` / `CLOSED` — **날짜로 자동 계산 권장** |

## 2) Product (상품 / 굿즈)
특정 팝업에 소속된 판매 굿즈.
| 필드 | 타입 | 설명 |
|------|------|------|
| id | ID(PK) | 고유 번호 |
| popup_id | FK→Popup | 어느 팝업 소속인가 |
| slug | string | URL용 이름 |
| name_ko / name_en | string | 상품명 (한/영) |
| description_ko | text | 상품 설명 원문(한글) |
| description_en | text | **AI 자동 번역** 결과(영어) |
| category | enum | `KEYRING`/`STICKER`/`ECOBAG`/`PHOTOCARD`/`STAND`/`ETC` |
| price_krw | int | 가격(원 단위, 정수) |
| image_urls | string[] | 상품 이미지들 |
| stock | int | 재고 수량(더미 데이터로 관리) |
| is_active | bool | 판매중 여부 |

## 3) CartItem (장바구니 항목)
비회원이므로 **로그인 대신 브라우저 세션/localStorage에 묶는다**. MVP에선 서버 저장
없이 클라이언트에만 둬도 충분.
| 필드 | 타입 | 설명 |
|------|------|------|
| product_id | FK→Product | 담은 상품 |
| quantity | int | 수량 |

## 4) Order (주문)
'주문 완료' 시 생성. 비회원 + 모의결제.
| 필드 | 타입 | 설명 |
|------|------|------|
| id | ID(PK) | 고유 번호 |
| order_number | string | 사람이 읽는 주문번호 (예: `SS-20260702-0001`) |
| orderer_name | string | 주문자 이름 |
| orderer_email | string | 연락 이메일 |
| shipping_country | string | 배송 국가 |
| shipping_address | text | 배송 주소 |
| shipping_region | enum | `KR`/`ASIA`/`OTHER` — 배송비 결정 |
| subtotal_krw | int | 상품 합계 |
| shipping_fee_krw | int | 배송비 |
| total_krw | int | 최종 합계 |
| status | enum | MVP: `CREATED`(모의결제 완료). 이후 `PAID`/`SHIPPED` 등 |
| created_at | datetime | 주문 시각 |

## 5) OrderItem (주문 상세 — 스냅샷)
주문에 담긴 상품 목록. **중요**: 주문 당시의 이름·가격을 **복사(snapshot)** 해 둔다.
나중에 상품 가격이 바뀌어도 과거 주문 내역은 그대로여야 하기 때문.
| 필드 | 타입 | 설명 |
|------|------|------|
| id | ID(PK) | 고유 번호 |
| order_id | FK→Order | 어느 주문 |
| product_id | FK→Product | 참조용(원본 상품) |
| product_name_snapshot | string | 주문 당시 상품명 |
| price_krw_snapshot | int | 주문 당시 가격 |
| quantity | int | 수량 |

## 6) 설정성 데이터 (테이블 대신 상수/설정으로)
- **배송비 표(ShippingRegion)**: `KR`, `ASIA`, `OTHER` 별 고정 배송비(원). 코드 상수로 관리.
- **환율(Currency)**: KRW→USD 고정 환산율 1개. 화면에 "≈ $XX" 참고 표시용.
- **UI 다국어 문자열(i18n)**: 버튼·라벨 등은 DB가 아니라 번역 파일(json: ko/en)로.

## 지금은 안 만드는 것 (2차 이후)
`User`(회원), `Review`(리뷰), `Wishlist`, `Payment`(실제 PG), `Admin`, `RestockAlert`.
→ 결정 0004·0006의 MVP 경량화 원칙.

## 설계 포인트 (초심자용 학습 메모)
- **다국어 필드**: MVP는 `_ko`/`_en` 두 열로 단순하게. 언어가 늘면 별도 번역 테이블로
  리팩터링(지금은 과설계 금지).
- **status는 저장보다 계산**: 팝업 열림/마감은 오늘 날짜와 기간을 비교해 그때그때 계산하면
  데이터가 낡지 않는다.
- **스냅샷 원칙**: 주문은 "그 시점의 사실"을 박제한다 → OrderItem에 이름·가격 복사.

---
_v1.0 · 2026-07-02 · 다음: 기술 스택 결정 → 개발 단계_
