# leetaeho.com

이태호의 개인 사이트. Astro로 만든 정적 사이트이며 Cloudflare Pages에서 무료로 호스팅합니다.

## 구성

| 역할 | 도구 |
| --- | --- |
| 사이트 생성 | Astro |
| 글쓰기 화면 | Pages CMS (app.pagescms.org) — 설정 파일 `.pages.yml` |
| 원고 보관 | 이 GitHub 저장소 |
| 호스팅 | Cloudflare Pages |
| 사이트 검색 | Pagefind (빌드 때 자동 생성) |
| 뉴스레터 | 메일리 |

## 자주 고치는 곳

- 이름·태그라인·이메일·뉴스레터 주소: `src/site.ts`
- 홈 소개문: `src/content/pages/home.md` (편집 화면의 "홈 소개문")
- About 본문: `src/content/pages/about.md` (편집 화면의 "About 페이지")
- 색·글꼴·여백: `src/styles/global.css`
- 글: `src/content/writing/*.md`
- 작업: `src/content/work/*.md`
- 사진: `public/images/uploads/`

## 글 규칙

- `draft: true`인 글은 사이트에 나오지 않습니다. 공개하려면 체크를 해제합니다.
- `slug`(영문 주소)를 넣으면 주소가 `leetaeho.com/writing/<slug>/`가 됩니다. 비워 두면 파일 이름이 주소가 됩니다.
- 실무노트·AI 글 끝에는 "법률자문이 아님" 고지가 자동으로 붙습니다.

## Cloudflare Pages 빌드 설정

- Framework preset: Astro
- Build command: `npm run build` (검색 색인은 빌드 과정에서 자동 생성)
- Build output directory: `dist`
- 환경변수: `NODE_VERSION` = `22`

## 로컬에서 실행

```
npm install
npm run dev     # http://localhost:4321
npm run build   # dist/ 에 결과물 생성
```
