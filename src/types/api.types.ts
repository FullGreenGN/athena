/*

{
  ok: true,
  status: 200,
  json: [
    {
      id: 376,
      name: 'La Heap',
      slug: 'c-piscine-perpignan-la-heap',
      image_url: 'https://cdn.intra.42.fr/coalition/image/376/Heap.svg',
      cover_url: 'https://cdn.intra.42.fr/coalition/cover/376/Heap_background_3_low.jpg',
      color: '#ffc5a2',
      score: 17598,
      user_id: 133320
    }
  ]
}
*/

export interface Coaltion {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    cover_url: string;
    color: string;
    score: number;
    user_id: number;
}
