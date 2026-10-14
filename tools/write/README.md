# 글쓰기 도구 (leetaeho.com/write/)

- 실제로 쓰이는 파일은 `public/write/index.html` 하나입니다(라이브러리까지 한 파일에 들어 있음).
- `editor.html`은 라이브러리를 뺀 원본이고, `build.mjs`가 marked·turndown을 끼워 넣어 위 파일을 만듭니다.
  - `npm i --no-save marked@15 turndown turndown-plugin-gfm`
  - `node tools/write/build.mjs tools/write/editor.html public/write/index.html node_modules`
- 글·사진은 브라우저(IndexedDB)에 저장되고, 발행 시 GitHub API로 글(.md)과 사진을 한 커밋으로 올립니다.
