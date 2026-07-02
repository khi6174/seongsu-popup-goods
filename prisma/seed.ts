// 시드 데이터 — 사용자 시나리오(05)가 돌아가도록 팝업 3개 + 굿즈(품절 케이스 포함).
// 날짜는 '지금' 기준 상대값으로 만들어 상태(열림/마감임박)가 자연스럽게 나오게 한다.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 시드는 일회성 스크립트라 세션 풀러(DIRECT_URL, 5432)로 접속.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const now = Date.now();
const DAY = 1000 * 60 * 60 * 24;
const daysFromNow = (d: number) => new Date(now + d * DAY);

async function main() {
  // 기존 데이터 정리 (idempotent seed)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.popup.deleteMany();

  // ── 팝업 1: 치즈냥 (열림) ──────────────────────────────
  const cheese = await prisma.popup.create({
    data: {
      slug: "cheese-cat",
      nameKo: "치즈냥 팝업스토어",
      nameEn: "Cheese Cat Popup Store",
      descriptionKo:
        "노랗고 통통한 치즈냥의 첫 공식 팝업. 성수동에서 한정 굿즈를 만나보세요.",
      descriptionEn:
        "The first official popup of chubby yellow Cheese Cat. Meet limited goods in Seongsu.",
      brand: "Cheese Cat Studio",
      thumbnailUrl: "",
      startDate: daysFromNow(-5),
      endDate: daysFromNow(12),
      location: "성수동 연무장길 12",
    },
  });

  // ── 팝업 2: 레트로 문구 (마감 임박) ─────────────────────
  const retro = await prisma.popup.create({
    data: {
      slug: "retro-stationery",
      nameKo: "레트로 문구 팝업",
      nameEn: "Retro Stationery Popup",
      descriptionKo:
        "90년대 감성의 문구 굿즈. 곧 마감되니 서둘러 만나보세요!",
      descriptionEn:
        "90s-vibe stationery goods. Closing soon — don't miss it!",
      brand: "Old School Paper",
      thumbnailUrl: "",
      startDate: daysFromNow(-14),
      endDate: daysFromNow(2),
      location: "성수동 서울숲2길 8",
    },
  });

  // ── 팝업 3: 민트베어 (열림) ────────────────────────────
  const mint = await prisma.popup.create({
    data: {
      slug: "mint-bear",
      nameKo: "민트베어 팝업",
      nameEn: "Mint Bear Popup",
      descriptionKo: "상큼한 민트색 곰돌이 캐릭터의 시즌 팝업.",
      descriptionEn: "A seasonal popup of the fresh mint-colored bear character.",
      brand: "Mint Bear",
      thumbnailUrl: "",
      startDate: daysFromNow(-3),
      endDate: daysFromNow(20),
      location: "성수동 성수이로 20",
    },
  });

  const products = [
    // 치즈냥
    {
      popupId: cheese.id,
      slug: "cheese-cat-keyring",
      nameKo: "치즈냥 아크릴 키링",
      nameEn: "Cheese Cat Acrylic Keyring",
      descriptionKo: "가방에 달기 좋은 반짝이는 아크릴 키링.",
      descriptionEn: "A shiny acrylic keyring, perfect for your bag.",
      category: "KEYRING",
      priceKrw: 12000,
      stock: 0, // 품절 케이스 (시나리오 B)
    },
    {
      popupId: cheese.id,
      slug: "cheese-cat-sticker-pack",
      nameKo: "치즈냥 스티커 팩",
      nameEn: "Cheese Cat Sticker Pack",
      descriptionKo: "다양한 표정의 치즈냥 스티커 12종 세트.",
      descriptionEn: "A set of 12 Cheese Cat stickers with various faces.",
      category: "STICKER",
      priceKrw: 8000,
      stock: 50,
    },
    {
      popupId: cheese.id,
      slug: "cheese-cat-ecobag",
      nameKo: "치즈냥 에코백",
      nameEn: "Cheese Cat Eco Bag",
      descriptionKo: "가볍고 튼튼한 캔버스 에코백.",
      descriptionEn: "A light and sturdy canvas eco bag.",
      category: "ECOBAG",
      priceKrw: 18000,
      stock: 30,
    },
    // 레트로 문구
    {
      popupId: retro.id,
      slug: "retro-sticker-sheet",
      nameKo: "레트로 스티커 시트",
      nameEn: "Retro Sticker Sheet",
      descriptionKo: "90년대 감성 가득한 스티커 시트.",
      descriptionEn: "A sticker sheet full of 90s nostalgia.",
      category: "STICKER",
      priceKrw: 6000,
      stock: 80,
    },
    {
      popupId: retro.id,
      slug: "retro-keyring",
      nameKo: "레트로 카세트 키링",
      nameEn: "Retro Cassette Keyring",
      descriptionKo: "추억의 카세트테이프 모양 키링.",
      descriptionEn: "A keyring shaped like a nostalgic cassette tape.",
      category: "KEYRING",
      priceKrw: 11000,
      stock: 25,
    },
    // 민트베어
    {
      popupId: mint.id,
      slug: "mint-bear-photocard",
      nameKo: "민트베어 포토카드 세트",
      nameEn: "Mint Bear Photocard Set",
      descriptionKo: "민트베어 포토카드 8종 랜덤 세트.",
      descriptionEn: "A random set of 8 Mint Bear photocards.",
      category: "PHOTOCARD",
      priceKrw: 9000,
      stock: 60,
    },
    {
      popupId: mint.id,
      slug: "mint-bear-stand",
      nameKo: "민트베어 아크릴 스탠드",
      nameEn: "Mint Bear Acrylic Stand",
      descriptionKo: "책상 위에 두기 좋은 아크릴 스탠드.",
      descriptionEn: "An acrylic stand that looks great on your desk.",
      category: "STAND",
      priceKrw: 15000,
      stock: 40,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: { ...p, imageUrls: "[]", isActive: true },
    });
  }

  console.log(
    `Seed 완료: 팝업 3개, 상품 ${products.length}개 (품절 1개 포함)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
