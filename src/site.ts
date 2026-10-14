// 사이트 전역 설정 — 이름·문구·링크는 여기서만 고치면 전체에 반영됩니다.
export const SITE = {
  url: 'https://leetaeho.com',
  name: '이태호',
  nameEn: 'Taeho Lee',
  title: '이태호 | 변호사·설계자',
  tagline: '구조를 설계합니다 — 법, 금융, 소리, 빛',
  description:
    '변호사 이태호의 개인 사이트. 법과 금융의 구조, 음악과 사진 작업, 그리고 일하는 방식에 대한 글을 씁니다.',
  email: 'hello@leetaeho.com',
  newsletter: 'https://maily.so/leetaeho',
  links: [
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/...' },
  ],
};

export const CATEGORIES = ['실무 노트', 'AI × 법무', '에세이'] as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Work', href: '/work/' },
];

// 카테고리 이름 → 주소용 영문 슬러그
export const categorySlug = (c: string) =>
  ({ '실무 노트': 'practice', 'AI × 법무': 'ai-law', 에세이: 'essay' } as Record<string, string>)[c] ?? 'etc';
